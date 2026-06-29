---
judul: Review Skill, Connector & Agent Claude
tipe: catatan
tags: [catatan, tooling, claude, konfigurasi]
diperbarui: 2026-06-29
---

# Review Skill, Connector & Agent Claude

Bagian dari [[index]].

## Ringkasan
Penilaian penting/tidaknya semua **skill**, **connector (MCP)**, dan **agent** yang terpasang di Claude, khusus untuk konteks proyek website statis Al-Qomar (HTML/CSS/JS, Netlify, tanpa build system). Tujuannya: tahu mana yang wajib aktif dan mana yang bisa dimatikan agar sesi lebih ringan.

Legenda: 🟢 wajib/sangat penting · 🟡 cukup/berguna · 🟠 kurang relevan · 🔴 tidak relevan.

## Detail

### 1. Skills (Slash Commands)
| Skill | Penilaian |
|-------|-----------|
| `/obsidian-memory` | 🟢 Sangat penting — memori antar sesi, sudah aktif via SessionStart hook |
| `/init` | 🟢 Penting — buat/refresh CLAUDE.md |
| `/code-review` | 🟢 Penting — review diff tiap edit HTML/CSS besar |
| `/security-review` | 🟡 Cukup — saat sentuh `_headers` (CSP), `login-divisi.html`, form PPDB |
| `/simplify` | 🟡 Cukup — `index.html` ~533 KB, bantu rapikan |
| `/session-start-hook` | 🟡 Cukup — jika menambah hook baru |
| `/update-config` | 🟡 Cukup — atur settings.json, permissions, hooks |
| `/fewer-permission-prompts` | 🟡 Nice-to-have — kurangi prompt izin |
| `/verify`, `/run` | 🟠 Kurang relevan — situs statis, cukup buka di browser |
| `/deep-research` | 🟠 Kurang relevan untuk coding; berguna untuk riset konten/SEO |
| `/loop` | 🟠 Kurang relevan — tidak ada tugas berkala |
| `/claude-api` | 🔴 Tidak relevan — proyek tanpa LLM |
| `/keybindings-help` | 🔴 Tidak relevan dgn proyek (preferensi pribadi) |

### 2. Connectors (MCP)
| Connector | Penilaian |
|-----------|-----------|
| `github` | 🟢 Sangat penting — satu-satunya jalur repo (PR, commit, CI). Wajib aktif |
| `Google_Drive` | 🟡 Cukup — bila aset/dokumen disimpan di Drive |
| `Gmail` | 🟡 Cukup — komunikasi PPDB (info@purnamacendekia.sch.id) |
| `Google_Calendar` | 🟡 Cukup — bantu isi section Event & Agenda |
| `Notion` / `Todoist` / `Asana` | 🟠 Opsional — manajemen tugas; pilih SATU saja |
| `Slack` / `Zoom_for_Claude` | 🟠 Opsional — komunikasi tim |
| `Figma` | 🟡 Cukup — terjemahkan desain UI ke HTML/CSS |
| `Gamma` / `Lovable` / `tldraw` | 🟠 Kurang relevan — desain/presentasi/app-builder, tak cocok situs statis manual |
| `Higgsfield` / `HyperFrames_by_HeyGen` | 🔴 Tidak relevan — generator video/avatar AI |
| `Expedia` | 🔴 Tidak relevan — travel booking |
| `HubSpot` / `Ramp_Data` | 🔴 Tidak relevan — CRM & data keuangan korporat |
| `mcp_cool` (Composio) | ❓ Perlu dicek manual — gateway Composio, nama generik |

### 3. Agents (Subagent Types)
| Agent | Penilaian |
|-------|-----------|
| `Explore` | 🟢 Penting — telusuri file besar tanpa banjir konteks |
| `general-purpose` | 🟢 Penting — tugas multi-langkah |
| `claude` | 🟢 Penting — default catch-all |
| `Plan` | 🟡 Cukup — perubahan besar (redesain section) |
| `claude-code-guide` | 🟡 Cukup — tanya soal Claude Code/hooks/MCP |
| `statusline-setup` | 🟠 Kurang relevan — kosmetik CLI |

## Rekomendasi
- **Wajib aktif:** skill `/obsidian-memory`, `/code-review`, `/init`, `/security-review`, `/simplify`; connector `github`; agent `Explore`, `general-purpose`, `claude`.
- **Bisa dimatikan agar sesi ringan:** connector `Expedia`, `HubSpot`, `Ramp_Data`, `Higgsfield`, `HyperFrames_by_HeyGen`, `Gamma`, `Lovable`; skill `/claude-api`, `/keybindings-help`, `/loop`.
- **Cek manual:** connector `mcp_cool` (Composio) — pastikan memang sengaja dipasang.

## Tautan Terkait
- [[konteks-proyek]]
- [[konvensi-kode]]
