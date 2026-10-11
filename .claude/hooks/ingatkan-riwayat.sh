#!/usr/bin/env bash
# Stop hook: kalau ada file proyek berubah tapi riwayat perbaikan/fitur belum
# diperbarui, blok penghentian sekali dan minta Claude mencatat dulu.
# Aman dari loop: stop_hook_active=true -> langsung lolos.
set -u

INPUT="$(cat)"
if printf '%s' "$INPUT" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$DIR" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Perubahan di luar memori/konfigurasi Claude (file tes zz-hook-test* dikecualikan).
CHANGED="$(git status --porcelain -- . ':!memory' ':!.claude' ':!CLAUDE.md' ':!zz-hook-test*' 2>/dev/null)"
[ -z "$CHANGED" ] && exit 0

# Sudah ada pembaruan riwayat?
LOG="$(git status --porcelain -- memory/catatan/riwayat-perbaikan.md memory/catatan/riwayat-fitur.md 2>/dev/null)"
[ -n "$LOG" ] && exit 0

cat <<'JSON'
{"decision":"block","reason":"Ada file proyek yang berubah tapi riwayat belum dicatat. Sebelum selesai: tambah entri di memory/catatan/riwayat-perbaikan.md (jika perbaikan bug; format: memory/templates/perbaikan.md) atau memory/catatan/riwayat-fitur.md (jika fitur/halaman baru). Isi gejala, penyebab, solusi, file yang diubah, status deploy ke Hostinger, dan 'jangan diulang'. Jika perubahan ini bukan perbaikan/fitur (mis. hanya eksperimen yang dibatalkan), cukup jelaskan singkat ke user lalu selesai."}
JSON
exit 0
