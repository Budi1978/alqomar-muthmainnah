#!/usr/bin/env python3
"""
pii_scan.py — Deteksi & redaksi data pribadi format Indonesia (UU 27/2022 PDP).

Dipakai oleh skill `pdp-indonesia` sebelum data siswa / wali murid / guru /
jamaah keluar dari lingkungan kerja (dipaste ke chat, artifact, Gamma, Canva,
Notion, Slack, broadcast WA, atau dikirim ke pihak luar).

Hanya stdlib (openpyxl opsional untuk .xlsx). Tidak mengirim data ke mana pun.

Pemakaian:
  pii_scan.py scan   <file|->            [--json] [--context N]
  pii_scan.py redact <file|->            [--mode tag|mask|hash] [--salt S] [--out PATH]
  pii_scan.py check  <nilai> [<nilai>...]  # validasi struktur NIK/NPWP/HP/kartu

Mode redaksi:
  tag   → ganti seluruh nilai dengan [NIK], [HP], dst. (default, paling aman)
  mask  → sisakan 2 digit awal + 3 digit akhir (3171*********0042) — cukup untuk
          rekonsiliasi manual, tidak cukup untuk identifikasi
  hash  → pseudonim deterministik sha256(salt+nilai)[:10] — untuk join antar
          tabel tanpa membawa identitas. WAJIB pakai --salt rahasia.

Exit code: 0 bersih, 1 ada temuan, 2 error.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Callable, Iterable

# ---------------------------------------------------------------------------
# Kode provinsi yang sah untuk 2 digit awal NIK / KK / nomor porsi haji
# (Kepmendagri 100.1.1-6117/2022). Kode 2x & 3x untuk Jakarta/Jawa dst.
# ---------------------------------------------------------------------------
KODE_PROVINSI = {
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21,          # Sumatra + Kepri
    31, 32, 33, 34, 35, 36,                          # Jawa + Banten
    51, 52, 53,                                      # Bali, NTB, NTT
    61, 62, 63, 64, 65,                              # Kalimantan
    71, 72, 73, 74, 75, 76,                          # Sulawesi
    81, 82,                                          # Maluku
    91, 92, 93, 94, 95, 96, 97,                      # Papua (termasuk DOB)
}

# Kata kunci konteks: dicek di ±60 karakter sekitar kandidat untuk
# membedakan deretan angka yang bentuknya sama (NIK vs KK vs NUPTK, rekening vs
# nomor registrasi, dst).
KONTEKS = {
    "NIK": r"\bnik\b|ktp|nomor\s*induk\s*kependudukan",
    "KK": r"\bkk\b|kartu\s*keluarga|no\.?\s*kk",
    "NISN": r"nisn",
    "NIS": r"\bnis\b|nomor\s*induk\s*siswa",
    "NIP": r"\bnip\b|pegawai\s*negeri",
    "NUPTK": r"nuptk",
    "NPWP": r"npwp|wajib\s*pajak",
    "PASPOR": r"paspor|passport|no\.?\s*pas",
    "REKENING": r"\brek(ening)?\b|no\.?\s*rek|\ba\.n\.?|\b(bca|mandiri|bni|bri|bsi|cimb|permata|danamon|btn)\b|transfer|norek",
    "PORSI_HAJI": r"porsi|siskohat|haji",
    "HP": r"\bhp\b|wa\b|whatsapp|telp|telepon|ponsel|kontak|nomor",
    "TGL_LAHIR": r"lahir|ttl|tanggal\s*lahir|dob",
}


# Overlay konteks: untuk file tabular, header kolom tiap sel ikut dihitung
# sebagai konteks (kata kunci ada di baris 1, bukan di sebelah nilai).
_HEADER_AT: Callable[[int], str] | None = None


def _ctx(text: str, start: int, end: int, span: int = 60) -> str:
    base = text[max(0, start - span): min(len(text), end + span)].lower()
    if _HEADER_AT is not None:
        h = _HEADER_AT(start)
        if h:
            return f"[{h.lower()}] " + base
    return base


def _has_ctx(text: str, start: int, end: int, key: str) -> bool:
    return re.search(KONTEKS[key], _ctx(text, start, end)) is not None


def _nearest_ctx(text: str, start: int, end: int, keys: Iterable[str]) -> str | None:
    """Kata kunci mana yang paling dekat dengan nilai? Header kolom (kalau ada)
    menang mutlak; kalau tidak, jarak karakter terdekat yang menang."""
    if _HEADER_AT is not None:
        h = _HEADER_AT(start).lower()
        for k in keys:
            if h and re.search(KONTEKS[k], h):
                return k
    span = 60
    lo = max(0, start - span)
    window = text[lo: min(len(text), end + span)].lower()
    best, best_d = None, 10 ** 9
    for k in keys:
        for m in re.finditer(KONTEKS[k], window):
            a, b = lo + m.start(), lo + m.end()
            d = start - b if b <= start else a - end
            if d < best_d:
                best, best_d = k, d
    return best


def _csv_header_lookup(text: str) -> Callable[[int], str] | None:
    """Petakan offset karakter -> nama kolom (header baris pertama) untuk CSV."""
    lines = text.split("\n")
    if len(lines) < 2:
        return None
    first = lines[0]
    if first.startswith("### sheet:"):
        first = lines[1] if len(lines) > 1 else ""
    try:
        header = next(csv.reader([first]))
    except Exception:  # noqa: BLE001
        return None
    if len(header) < 2:
        return None
    spans: list[tuple[int, int, str]] = []
    offset = 0
    cur_header = header
    for line in lines:
        if line.startswith("### sheet:"):
            offset += len(line) + 1
            cur_header = None
            continue
        try:
            fields = next(csv.reader([line]))
        except Exception:  # noqa: BLE001
            fields = []
        if cur_header is None:
            cur_header = fields
            offset += len(line) + 1
            continue
        cursor = 0
        for i, f in enumerate(fields):
            if not f:
                continue
            j = line.find(f, cursor)
            if j < 0:
                continue
            name = cur_header[i] if i < len(cur_header) else ""
            spans.append((offset + j, offset + j + len(f), name))
            cursor = j + len(f)
        offset += len(line) + 1

    def lookup(pos: int) -> str:
        for a, b, name in spans:
            if a <= pos < b:
                return re.sub(r"[_\-.]+", " ", name)
        return ""
    return lookup


def luhn_ok(digits: str) -> bool:
    total, alt = 0, False
    for ch in reversed(digits):
        d = int(ch)
        if alt:
            d *= 2
            if d > 9:
                d -= 9
        total += d
        alt = not alt
    return total % 10 == 0


def nik_struktur_ok(d: str) -> tuple[bool, str]:
    """Cek struktur NIK: PPKKCC DDMMYY SSSS. Tidak bisa memastikan NIK itu
    benar-benar terdaftar — hanya bentuknya sah."""
    if not re.fullmatch(r"\d{16}", d):
        return False, "bukan 16 digit"
    if int(d[:2]) not in KODE_PROVINSI:
        return False, f"kode provinsi {d[:2]} tidak dikenal"
    dd, mm = int(d[6:8]), int(d[8:10])
    if not (1 <= dd <= 31 or 41 <= dd <= 71):
        return False, f"tanggal lahir {dd:02d} tidak sah (laki 01-31, perempuan 41-71)"
    if not 1 <= mm <= 12:
        return False, f"bulan lahir {mm:02d} tidak sah"
    if d[12:] == "0000":
        return False, "nomor urut 0000"
    return True, "struktur NIK sah (P)" if dd > 40 else "struktur NIK sah (L)"


def npwp_struktur_ok(d: str) -> tuple[bool, str]:
    digits = re.sub(r"\D", "", d)
    if len(digits) == 15:
        return True, "NPWP format lama 15 digit"
    if len(digits) == 16:
        ok, why = nik_struktur_ok(digits)
        return ok, "NPWP 16 digit (NIK, Coretax) — " + why
    return False, "NPWP harus 15 atau 16 digit"


def hp_normal(d: str) -> str | None:
    digits = re.sub(r"\D", "", d)
    if digits.startswith("62"):
        digits = "0" + digits[2:]
    if re.fullmatch(r"08\d{8,11}", digits):
        return digits
    return None


# ---------------------------------------------------------------------------
# Definisi pola. Urutan penting: pola lebih spesifik lebih dulu, karena
# posisi yang sudah tertangkap tidak diproses lagi.
# ---------------------------------------------------------------------------
@dataclass
class Pola:
    jenis: str
    kategori: str            # "spesifik" (UU PDP Ps. 4 ayat 2) atau "umum"
    regex: re.Pattern
    # (teks_penuh, start, end, match) -> (terima?, catatan)
    verif: Callable[[str, int, int, re.Match], tuple[bool, str]]
    mask_keep: tuple[int, int] = (2, 3)


def _v_email(t, s, e, m):
    return True, ""


def _v_npwp15(t, s, e, m):
    return True, "format lama 15 digit"


def _v_16digit(t, s, e, m):
    """Deretan 16 digit bisa: NIK, KK, NUPTK, NPWP baru, kartu kredit."""
    d = re.sub(r"\D", "", m.group(0))
    ok, why = nik_struktur_ok(d)
    near = _nearest_ctx(t, s, e, ("NIK", "KK", "NUPTK", "NPWP"))
    if near == "KK":
        return True, "KK|" + ("struktur sah" if ok else why)
    if near == "NUPTK":
        return True, "NUPTK|16 digit"
    if near == "NPWP":
        return True, "NPWP|" + why
    if ok:
        return True, "NIK|" + why
    if luhn_ok(d):
        return True, "KARTU|16 digit lolos Luhn (kartu kredit/debit)"
    if near == "NIK":
        return True, "NIK|" + why + " (ada kata kunci NIK, cek manual)"
    return False, ""


def _v_18digit(t, s, e, m):
    return _has_ctx(t, s, e, "NIP"), "NIP 18 digit"


def _v_10digit(t, s, e, m):
    d = m.group(0)
    near = _nearest_ctx(t, s, e, ("NISN", "PORSI_HAJI", "REKENING"))
    if near == "NISN":
        return True, "NISN|10 digit"
    if near == "PORSI_HAJI" and int(d[:2]) in KODE_PROVINSI:
        return True, "PORSI_HAJI|10 digit"
    if near == "REKENING":
        return True, "REKENING|10 digit (BCA/BNI/BSI)"
    return False, ""


def _v_rekening(t, s, e, m):
    d = re.sub(r"\D", "", m.group(0))
    if len(d) in (10, 16, 18):      # sudah ditangani pola lain
        return False, ""
    return _has_ctx(t, s, e, "REKENING"), f"REKENING|{len(d)} digit"


def _v_hp(t, s, e, m):
    n = hp_normal(m.group(0))
    return n is not None, "HP|" + (n or "")


def _v_paspor(t, s, e, m):
    return _has_ctx(t, s, e, "PASPOR"), "paspor RI (huruf+digit)"


def _v_tgl(t, s, e, m):
    return _has_ctx(t, s, e, "TGL_LAHIR"), "tanggal lahir (data anak = spesifik)"


def _v_nis(t, s, e, m):
    return _has_ctx(t, s, e, "NIS") and not _has_ctx(t, s, e, "NISN"), "NIS sekolah"


POLA: list[Pola] = [
    Pola("EMAIL", "umum",
         re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), _v_email, (2, 0)),
    Pola("NPWP", "umum",
         re.compile(r"\b\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}\b"), _v_npwp15, (2, 3)),
    Pola("NIP", "umum", re.compile(r"\b\d{18}\b"), _v_18digit, (2, 3)),
    Pola("ID16", "spesifik",
         re.compile(r"\b\d{4}[ .-]?\d{4}[ .-]?\d{4}[ .-]?\d{4}\b|\b\d{16}\b"), _v_16digit, (2, 3)),
    Pola("HP", "umum",
         re.compile(r"(?<!\d)(?:\+?62|0)[ .-]?8\d{1,2}(?:[ .-]?\d{3,4}){2,3}(?!\d)"), _v_hp, (4, 3)),
    Pola("PASPOR", "umum",
         re.compile(r"\b[A-Z]{1,2}[ -]?\d{6,7}\b"), _v_paspor, (1, 2)),
    Pola("ID10", "umum", re.compile(r"\b\d{10}\b"), _v_10digit, (2, 3)),
    Pola("REKENING", "umum",
         re.compile(r"\b\d{3,4}[ -]?\d{2,4}[ -]?\d{3,6}(?:[ -]?\d{2,4})?\b|\b\d{11,15}\b"), _v_rekening, (2, 3)),
    Pola("TGL_LAHIR", "spesifik",
         re.compile(r"\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b|\b\d{1,2}\s+(?:jan(?:uari)?|feb(?:ruari)?|mar(?:et)?|apr(?:il)?|mei|jun(?:i)?|jul(?:i)?|agu(?:stus)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?)\s+(?:19|20)\d{2}\b", re.I),
         _v_tgl, (0, 4)),
    Pola("NIS", "umum", re.compile(r"\b\d{4,9}\b"), _v_nis, (1, 2)),
]


# UU 27/2022 Ps. 4: data pribadi SPESIFIK = kesehatan, biometrik, genetika,
# catatan kejahatan, DATA ANAK, DATA KEUANGAN PRIBADI. Sisanya umum.
# NIK/KK/HP/email siswa tetap spesifik karena milik anak — scanner tidak tahu
# pemiliknya, jadi ditandai "umum*" dan dijelaskan di legenda.
KATEGORI_PDP = {
    "REKENING": "spesifik", "KARTU": "spesifik", "TGL_LAHIR": "spesifik",
    "NISN": "spesifik", "NIS": "spesifik",
    "NIK": "umum*", "KK": "umum*", "HP": "umum*", "EMAIL": "umum*",
    "NPWP": "umum", "NUPTK": "umum", "NIP": "umum", "PASPOR": "umum*",
    "PORSI_HAJI": "umum",
}


@dataclass
class Temuan:
    jenis: str
    kategori: str
    nilai: str
    baris: int
    kolom: int
    catatan: str
    konteks: str


def _line_col(text: str, pos: int) -> tuple[int, int]:
    line = text.count("\n", 0, pos) + 1
    col = pos - (text.rfind("\n", 0, pos) + 1) + 1
    return line, col


def pindai(text: str, ctx_chars: int = 30, tabular: bool = False) -> list[Temuan]:
    global _HEADER_AT
    _HEADER_AT = _csv_header_lookup(text) if tabular else None
    taken = [False] * (len(text) + 1)
    hasil: list[Temuan] = []
    for p in POLA:
        for m in p.regex.finditer(text):
            s, e = m.start(), m.end()
            if any(taken[s:e]):
                continue
            ok, note = p.verif(text, s, e, m)
            if not ok:
                continue
            jenis = p.jenis
            if "|" in note:
                jenis, note = note.split("|", 1)
            kategori = KATEGORI_PDP.get(jenis, p.kategori)
            for i in range(s, e):
                taken[i] = True
            ln, col = _line_col(text, s)
            hasil.append(Temuan(
                jenis, kategori, m.group(0), ln, col, note.strip(),
                text[max(0, s - ctx_chars): e + ctx_chars].replace("\n", " ")))
    hasil.sort(key=lambda t: (t.baris, t.kolom))
    return hasil


def _mask(nilai: str, keep: tuple[int, int]) -> str:
    head, tail = keep
    core = re.sub(r"\s", "", nilai)
    if len(core) <= head + tail:
        return "*" * len(core)
    return core[:head] + "*" * (len(core) - head - tail) + (core[-tail:] if tail else "")


def redaksi(text: str, mode: str = "tag", salt: str = "", tabular: bool = False) -> tuple[str, list[Temuan]]:
    temuan = pindai(text, tabular=tabular)
    # ganti dari belakang supaya offset tidak bergeser
    spans = []
    pos_map = []
    for t in temuan:
        # cari posisi absolut dari (baris, kolom)
        line_start = 0
        for _ in range(t.baris - 1):
            line_start = text.index("\n", line_start) + 1
        s = line_start + t.kolom - 1
        spans.append((s, s + len(t.nilai), t))
    out = text
    for s, e, t in sorted(spans, reverse=True):
        if mode == "tag":
            rep = f"[{t.jenis}]"
        elif mode == "mask":
            keep = next((p.mask_keep for p in POLA if p.jenis == t.jenis), (2, 3))
            if t.jenis in ("NIK", "KK", "NUPTK", "NPWP", "KARTU"):
                keep = (2, 3)
            if t.jenis == "EMAIL":
                user, _, dom = t.nilai.partition("@")
                rep = user[:2] + "***@" + dom
            else:
                rep = _mask(t.nilai, keep)
        elif mode == "hash":
            if not salt:
                raise SystemExit("mode hash WAJIB pakai --salt (string rahasia, simpan di luar repo)")
            kanon = t.nilai.lower().strip() if t.jenis in ("EMAIL", "PASPOR") else re.sub(r"\D", "", t.nilai)
            if t.jenis == "HP":
                kanon = hp_normal(t.nilai) or kanon
            h = hashlib.sha256((salt + kanon).encode()).hexdigest()[:10]
            rep = f"{t.jenis}:{h}"
        else:
            raise SystemExit(f"mode tidak dikenal: {mode}")
        out = out[:s] + rep + out[e:]
    return out, temuan


# ---------------------------------------------------------------------------
# I/O
# ---------------------------------------------------------------------------
def baca(path: str) -> tuple[str, bool]:
    """-> (teks, tabular?). CSV/TSV/XLSX dianggap tabular: header kolom jadi konteks."""
    if path == "-":
        return sys.stdin.read(), False
    p = Path(path)
    if not p.exists():
        raise SystemExit(f"file tidak ada: {path}")
    suf = p.suffix.lower()
    if suf in (".xlsx", ".xlsm"):
        try:
            import openpyxl  # type: ignore
        except ImportError:
            raise SystemExit("butuh openpyxl untuk .xlsx — atau ekspor ke CSV dulu")
        wb = openpyxl.load_workbook(p, read_only=True, data_only=True)
        buf = io.StringIO()
        for ws in wb.worksheets:
            buf.write(f"### sheet: {ws.title}\n")
            w = csv.writer(buf)
            for row in ws.iter_rows(values_only=True):
                w.writerow(["" if c is None else str(c) for c in row])
        return buf.getvalue(), True
    if suf == ".json":
        return json.dumps(json.loads(p.read_text(encoding="utf-8")), ensure_ascii=False, indent=1), False
    return p.read_text(encoding="utf-8", errors="replace"), suf in (".csv", ".tsv")


def ringkasan(temuan: list[Temuan]) -> dict:
    per_jenis: dict[str, int] = {}
    for t in temuan:
        per_jenis[t.jenis] = per_jenis.get(t.jenis, 0) + 1
    return {
        "total": len(temuan),
        "spesifik": sum(1 for t in temuan if t.kategori == "spesifik"),
        "umum": sum(1 for t in temuan if t.kategori.startswith("umum")),
        "per_jenis": dict(sorted(per_jenis.items(), key=lambda kv: -kv[1])),
    }


def cmd_scan(a) -> int:
    text, tab = baca(a.file)
    temuan = pindai(text, a.context, tabular=tab or a.csv)
    r = ringkasan(temuan)
    if a.json:
        print(json.dumps({"ringkasan": r, "temuan": [asdict(t) for t in temuan]},
                         ensure_ascii=False, indent=1))
    else:
        if not temuan:
            print("BERSIH — tidak ada data pribadi format Indonesia terdeteksi.")
            print("(Nama, alamat, dan foto tetap harus dicek manual.)")
            return 0
        print(f"TEMUAN: {r['total']} (spesifik: {r['spesifik']}, umum: {r['umum']})")
        for k, v in r["per_jenis"].items():
            print(f"  {k:<11} {v}")
        print()
        print(f"{'baris':>5} {'jenis':<10} {'kategori':<9} nilai / catatan")
        for t in temuan:
            print(f"{t.baris:>5} {t.jenis:<10} {t.kategori:<9} {t.nilai}  — {t.catatan}")
            if a.context:
                print(f"{'':>5} {'':<10} {'':<9} …{t.konteks}…")
        print()
        print("Kategori UU 27/2022: spesifik = data keuangan/anak (wajib perlindungan ekstra); "
              "umum* = umum, tapi SPESIFIK bila milik siswa/anak.")
        print("Vonis: JANGAN keluarkan file ini apa adanya. Jalankan `redact`, "
              "atau hapus kolom yang tidak diperlukan penerima.")
    return 1 if temuan else 0


def cmd_redact(a) -> int:
    text, tab = baca(a.file)
    out, temuan = redaksi(text, a.mode, a.salt, tabular=tab or a.csv)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
        print(f"ditulis: {a.out} — {len(temuan)} nilai diredaksi (mode {a.mode})", file=sys.stderr)
    else:
        sys.stdout.write(out)
        print(f"\n# {len(temuan)} nilai diredaksi (mode {a.mode})", file=sys.stderr)
    return 0


def cmd_check(a) -> int:
    code = 0
    for v in a.nilai:
        d = re.sub(r"\D", "", v)
        if re.fullmatch(r"\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}", v) or (len(d) == 15 and "npwp" in v.lower()):
            ok, why = npwp_struktur_ok(v)
        elif len(d) == 16:
            ok, why = nik_struktur_ok(d)
            if not ok and luhn_ok(d):
                ok, why = True, "bukan NIK, tapi lolos Luhn → kemungkinan kartu kredit/debit"
        elif hp_normal(v):
            ok, why = True, f"nomor HP Indonesia → {hp_normal(v)}"
        else:
            ok, why = False, "tidak dikenali sebagai NIK/NPWP/HP"
        print(f"{'SAH ' if ok else 'TDK '} {v}: {why}")
        code = code or (0 if ok else 1)
    return code


def main(argv: Iterable[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("scan", help="deteksi data pribadi")
    s.add_argument("file")
    s.add_argument("--json", action="store_true")
    s.add_argument("--context", type=int, default=0, metavar="N", help="tampilkan N karakter konteks")
    s.add_argument("--csv", action="store_true", help="paksa mode tabular (header kolom = konteks), mis. untuk stdin")
    s.set_defaults(fn=cmd_scan)
    r = sub.add_parser("redact", help="redaksi data pribadi")
    r.add_argument("file")
    r.add_argument("--mode", choices=["tag", "mask", "hash"], default="tag")
    r.add_argument("--salt", default="")
    r.add_argument("--out")
    r.add_argument("--csv", action="store_true", help="paksa mode tabular")
    r.set_defaults(fn=cmd_redact)
    c = sub.add_parser("check", help="validasi struktur NIK/NPWP/HP")
    c.add_argument("nilai", nargs="+")
    c.set_defaults(fn=cmd_check)
    a = ap.parse_args(argv)
    try:
        return a.fn(a)
    except SystemExit:
        raise
    except Exception as ex:  # noqa: BLE001
        print(f"error: {ex}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
