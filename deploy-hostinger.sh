#!/usr/bin/env bash
#
# deploy-hostinger.sh — upload perubahan ke public_html Hostinger lewat FTPS.
#
# Dijalankan dari komputer sendiri, di dalam folder repositori ini:
#   bash deploy-hostinger.sh
#
# Kredensial FTP diminta saat skrip berjalan dan tidak pernah disimpan.
# Ambil host/username di hPanel -> Files -> FTP Accounts.
# Hanya butuh curl, yang sudah tersedia bawaan di macOS dan Linux.

set -euo pipefail

REMOTE_DIR="public_html"

# Berkas yang di-upload, format "nama-di-server". Nama lokal boleh berbeda:
# unduhan dari browser sering mengubah .htaccess menjadi htaccess.txt, dan
# skrip ini mengenali variasi itu lalu mengunggahnya dengan nama yang benar.
UPLOAD=(
  "index.html"
  ".htaccess"
  "robots.txt"
)

# Cari berkas lokal untuk sebuah nama tujuan; cetak path yang ditemukan.
cari_lokal() {
  local tujuan="$1" kandidat
  for kandidat in "$tujuan" "${tujuan#.}" "${tujuan#.}.txt" "$tujuan.txt"; do
    if [ -f "$kandidat" ]; then
      printf '%s' "$kandidat"
      return 0
    fi
  done
  return 1
}

# Snapshot lama yang harus dihapus dari server — sudah dipindah ke _backup/ di repo
HAPUS=(
  "index-live.html"
  "index-live-latest.html"
  "index-live copy.html"
  "index-live-backup-20260515.html"
  "index-live-backup-20260515-163308.html"
  "index-live-backup-20260517-233925.html"
  "index-live-backup-bergabung-20260515.html"
  "index-backup-2026-04-27.html"
  "berita-backup-20260517-233925.html"
  "berita-detail-backup-20260614-005713.html"
  "images/index-live.html"
)

for f in "${UPLOAD[@]}"; do
  cari_lokal "$f" >/dev/null || {
    echo "Berhenti: tidak menemukan berkas untuk '$f' di folder ini."
    echo "Pastikan skrip dijalankan dari folder yang berisi index.html, .htaccess"
    echo "(atau htaccess.txt hasil unduhan), dan robots.txt."
    exit 1
  }
done

read -r -p "FTP host (mis. ftp.alqomar.sch.id): " FTP_HOST
read -r -p "FTP username                     : " FTP_USER
read -r -s -p "FTP password                     : " FTP_PASS
echo

# Bersihkan isian host: buang spasi, awalan skema, dan akhiran path.
FTP_HOST="$(printf '%s' "$FTP_HOST" | tr -d '[:space:]')"
FTP_HOST="${FTP_HOST#ftps://}"
FTP_HOST="${FTP_HOST#ftp://}"
FTP_HOST="${FTP_HOST#sftp://}"
FTP_HOST="${FTP_HOST#*@}"
FTP_HOST="${FTP_HOST%%/*}"
FTP_USER="$(printf '%s' "$FTP_USER" | tr -d '[:space:]')"

if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo
  echo "Berhenti: host, username, dan password tidak boleh kosong."
  echo "Ambil ketiganya di hPanel -> Files -> FTP Accounts, lalu jalankan lagi."
  exit 1
fi

echo
echo "Target: ftp://$FTP_HOST/$REMOTE_DIR/  (user: $FTP_USER)"

# Pilih mode koneksi teraman yang diterima server, dari yang paling ketat.
# Server Hostinger kadang memakai sertifikat yang kedaluwarsa; dalam kondisi itu
# FTPS tetap dipakai (password terenkripsi) hanya tanpa verifikasi sertifikat.
uji_mode() {
  curl -sS --max-time 25 "$@" --user "$FTP_USER:$FTP_PASS" \
    -o /dev/null "ftp://$FTP_HOST/$REMOTE_DIR/" 2>/dev/null
}

if uji_mode --ssl-reqd; then
  MODE=(--ssl-reqd)
  echo "Koneksi: FTPS, sertifikat terverifikasi."
elif uji_mode --ssl-reqd -k; then
  MODE=(--ssl-reqd -k)
  echo "Koneksi: FTPS aktif, tetapi sertifikat server tidak valid (kedaluwarsa)."
  echo "         Password tetap terenkripsi. Laporkan sertifikat ini ke Hostinger."
elif uji_mode; then
  echo
  echo "PERINGATAN: server menolak enkripsi. FTP polos mengirim password"
  echo "            tanpa perlindungan dan bisa disadap di jaringan publik."
  read -r -p "Lanjutkan tanpa enkripsi? (ketik: ya) " JAWAB
  [ "$JAWAB" = "ya" ] || { echo "Dibatalkan."; exit 1; }
  MODE=()
  echo "Koneksi: FTP polos."
else
  echo
  echo "Berhenti: tidak bisa tersambung ke ftp://$FTP_HOST/$REMOTE_DIR/"
  echo "Periksa kembali host, username, dan password di hPanel -> FTP Accounts."
  exit 1
fi

CURL=(curl -sS "${MODE[@]}" --user "$FTP_USER:$FTP_PASS")

echo
echo "== Upload =="
for f in "${UPLOAD[@]}"; do
  lokal="$(cari_lokal "$f")"
  if "${CURL[@]}" -T "$lokal" "ftp://$FTP_HOST/$REMOTE_DIR/$f"; then
    if [ "$lokal" = "$f" ]; then
      echo "  terkirim : $f"
    else
      echo "  terkirim : $lokal  ->  $f  (nama diperbaiki otomatis)"
    fi
  else
    echo "  GAGAL    : $f  (curl keluar dengan kode $?)"
  fi
done

echo
echo "== Hapus snapshot lama =="
for f in "${HAPUS[@]}"; do
  if "${CURL[@]}" -Q "DELE /$REMOTE_DIR/$f" "ftp://$FTP_HOST/$REMOTE_DIR/" -o /dev/null 2>/dev/null; then
    echo "  dihapus  : $f"
  else
    echo "  dilewati : $f (mungkin sudah tidak ada)"
  fi
done

echo
echo "== Isi public_html setelah deploy =="
"${CURL[@]}" "ftp://$FTP_HOST/$REMOTE_DIR/" 2>/dev/null \
  | grep -iE "index|robots|htaccess" || echo "  (daftar tidak bisa dibaca)"

echo
echo "Selesai. Buka https://alqomar.sch.id/?v=$(date +%s) untuk memeriksa hasilnya."
