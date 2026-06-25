#!/usr/bin/env bash
# SessionStart hook: muat memori Obsidian (memory/index.md) ke konteks Claude.
# stdout dari hook ini ditambahkan sebagai konteks sesi.
set -euo pipefail

# Cari root repo (lokasi folder memory/), fallback ke CWD.
DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
INDEX="$DIR/memory/index.md"

if [[ -f "$INDEX" ]]; then
  echo "## 🧠 Memori Proyek (Obsidian vault: memory/)"
  echo
  echo "Konteks berikut dimuat otomatis dari memori persisten proyek."
  echo "Pakai skill /obsidian-memory untuk membaca lebih dalam, menyimpan, atau memperbarui catatan."
  echo
  echo "---"
  cat "$INDEX"
else
  echo "## 🧠 Memori Proyek"
  echo "Vault memori belum ada (memory/index.md tidak ditemukan)."
fi
