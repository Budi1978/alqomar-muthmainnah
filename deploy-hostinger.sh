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

# Berkas yang di-upload (timpa versi lama di server)
UPLOAD=(
  "index.html"
  ".htaccess"
  "robots.txt"
)

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
  [ -f "$f" ] || { echo "Berhenti: $f tidak ada. Jalankan skrip dari folder repositori."; exit 1; }
done

read -r -p "FTP host (mis. ftp.alqomar.sch.id): " FTP_HOST
read -r -p "FTP username                     : " FTP_USER
read -r -s -p "FTP password                     : " FTP_PASS
echo

# --ssl-reqd mewajibkan FTPS, supaya password tidak dikirim polos.
CURL=(curl -sS --ssl-reqd --user "$FTP_USER:$FTP_PASS")

echo
echo "== Upload =="
for f in "${UPLOAD[@]}"; do
  if "${CURL[@]}" -T "$f" "ftp://$FTP_HOST/$REMOTE_DIR/$f"; then
    echo "  terkirim : $f"
  else
    echo "  GAGAL    : $f"
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
echo "Selesai. Buka https://alqomar.sch.id/?v=$(date +%s) untuk memeriksa hasilnya."
