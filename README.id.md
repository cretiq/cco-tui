# Claude Code Organizer

[![npm version](https://img.shields.io/npm/v/@mcpware/claude-code-organizer)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![npm downloads](https://img.shields.io/npm/dt/@mcpware/claude-code-organizer?label=downloads)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![GitHub stars](https://img.shields.io/github/stars/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [廣東話](README.zh-HK.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | Bahasa Indonesia | [Italiano](README.it.md) | [Português](README.pt-BR.md) | [Türkçe](README.tr.md) | [Tiếng Việt](README.vi.md) | [ไทย](README.th.md)

**Rapikan semua memory, skill, MCP server, dan hook Claude Code Anda — lihat berdasarkan hierarki scope, pindahkan antar-scope lewat drag-and-drop.**

![Claude Code Organizer Demo](docs/demo.gif)

## masalahnya

Setiap kali dipakai, Claude Code diam-diam membuat memory, skill, dan config MCP, lalu menaruhnya ke scope yang dianggap cocok berdasarkan direktori aktif Anda. Preferensi yang seharusnya berlaku di semua tempat? Malah terkunci di satu Project. Skill deploy yang seharusnya hanya hidup di satu repo? Bocor ke Global dan ikut mengotori project lain.

**Ini bukan cuma soal berantakan, tetapi juga soal performa AI Anda.** Di setiap sesi, Claude memuat semua config dari scope aktif beserta semua yang diwarisi dari parent scope ke dalam context window. Item yang salah scope berarti token terbuang, context tercemar, dan akurasi ikut turun. Skill Python pipeline yang tersimpan di Global bisa ikut dimuat saat Anda sedang mengerjakan frontend React. Entri MCP yang duplikat dapat menginisialisasi server yang sama dua kali. Memory lama pun bisa berbenturan dengan instruksi terbaru Anda.

### "suruh saja Claude yang membereskannya"

Anda memang bisa meminta Claude Code mengelola config-nya sendiri. Tetapi praktiknya tetap merepotkan: `ls` satu direktori, `cat` file satu per satu, lalu merangkai sendiri gambaran besarnya dari serpihan output teks. **Tidak ada satu command pun yang bisa menampilkan seluruh tree** lintas semua scope, semua item, dan seluruh inheritance sekaligus.

### solusinya: dashboard visual

```bash
npx @mcpware/claude-code-organizer
```

Cukup satu command. Semua yang disimpan Claude langsung terlihat, tersusun menurut hierarki scope. **Pindahkan item antar-scope dengan drag-and-drop.** Hapus stale memory. Temukan duplikat. Kendalikan apa saja yang benar-benar memengaruhi perilaku Claude.

### contoh: Project → Global

Anda pernah memberi tahu Claude, "I prefer TypeScript + ESM", saat sedang berada di sebuah project, padahal preferensi itu berlaku untuk semua pekerjaan Anda. Buka dashboard, lalu drag memory tersebut dari Project ke Global. **Selesai. Cukup sekali drag.**

### contoh: Global → Project

Ada skill deploy di Global yang sebenarnya hanya relevan untuk satu repo. Drag skill itu ke scope Project yang tepat, dan project lain tidak akan ikut melihatnya lagi.

### contoh: hapus memory yang sudah usang

Claude bisa membuat memory otomatis dari hal-hal yang Anda ucapkan sambil lalu, atau dari sesuatu yang *menurutnya* perlu diingat. Seminggu kemudian isinya sudah tidak relevan, tetapi tetap dimuat di setiap sesi. Buka, baca, hapus. **Anda yang menentukan apa yang Claude anggap ia ketahui tentang Anda.**

---

## fitur

- **Hierarki berbasis scope** — Semua item terlihat dalam susunan Global > Workspace > Project, lengkap dengan indikator inheritance
- **Drag-and-drop** — Pindahkan memory antar-scope, skill antara Global dan per-repo, MCP server antar-config
- **Konfirmasi perpindahan** — Setiap perpindahan selalu memunculkan modal konfirmasi sebelum file apa pun disentuh
- **Pembatasan berdasarkan tipe** — Memory hanya bisa dipindahkan ke folder Memory, skill ke folder skill, dan MCP ke config MCP
- **Search & filter** — Cari item seketika di seluruh daftar, lalu filter berdasarkan kategori (Memory, Skills, MCP, Config, Hooks, Plugins, Plans)
- **Detail panel** — Klik item mana pun untuk melihat metadata lengkap, deskripsi, file path, dan membukanya di VS Code
- **Scan penuh per-project** — Setiap scope menampilkan semua jenis item: memory, skill, MCP server, config, hook, dan plan
- **Perpindahan file sungguhan** — File benar-benar dipindahkan di `~/.claude/`, bukan sekadar viewer
- **45 E2E tests** — Test suite Playwright dengan verifikasi filesystem nyata setelah setiap operasi

## mengapa pakai dashboard visual?

Claude Code sebenarnya sudah bisa menampilkan dan memindahkan file lewat CLI, tetapi kalau Anda ingin memahami config sendiri, ujung-ujungnya tetap harus bongkar satu-satu sambil menebak-nebak. Dashboard ini memberi **visibilitas penuh dalam sekali lihat:**

| Yang ingin Anda lakukan | Tanya Claude | dashboard visual |
|---------------|:-----------:|:----------------:|
| **Melihat semuanya sekaligus** lintas semua scope | `ls` satu direktori setiap kali, lalu rangkai sendiri | Tree scope, cukup sekali lihat |
| **Apa saja yang dimuat di project aktif saya?** | Jalankan beberapa command, lalu berharap tidak ada yang terlewat | Buka project → lihat seluruh rantai inheritance |
| **Memindahkan item antar-scope** | Cari path yang sudah di-encode, lalu `mv` manual | Drag-and-drop dengan konfirmasi |
| **Membaca isi config** | `cat` tiap file satu per satu | Klik → panel samping |
| **Mencari duplikat / item usang** | `grep` di direktori yang sulit dibaca | Search + filter per kategori |
| **Membersihkan memory yang tidak terpakai** | Tentukan sendiri file mana yang harus dihapus | Jelajahi, baca, hapus di tempat |

## mulai cepat

### opsi 1: npx (tanpa install)

```bash
npx @mcpware/claude-code-organizer
```

### opsi 2: install global

```bash
npm install -g @mcpware/claude-code-organizer
claude-code-organizer
```

### opsi 3: minta Claude

Tempelkan ini ke Claude Code:

> Jalankan `npx @mcpware/claude-code-organizer` — ini dashboard untuk mengelola pengaturan Claude Code. Beri tahu saya URL-nya saat sudah siap.

Dashboard akan terbuka di `http://localhost:3847`. Aplikasi ini bekerja langsung dengan direktori `~/.claude/` Anda yang sebenarnya.

## yang dikelola

| Tipe | Lihat | Pindah | Di-scan di | Kenapa dikunci? |
|------|:----:|:----:|:----------:|-------------|
| Memories (feedback, user, project, reference) | Ya | Ya | Global + Project | — |
| Skills | Ya | Ya | Global + Project | — |
| MCP Servers | Ya | Ya | Global + Project | — |
| Config (CLAUDE.md, settings.json) | Ya | Dikunci | Global + Project | System settings — perpindahan bisa merusak config |
| Hooks | Ya | Dikunci | Global + Project | Bergantung pada context settings — jika dipindah bisa gagal diam-diam |
| Plans | Ya | Ya | Global + Project | — |
| Plugins | Ya | Dikunci | Global only | Cache yang dikelola Claude Code |

## hierarki scope

```
Global                       <- applies everywhere
  Company (workspace)        <- applies to all sub-projects
    CompanyRepo1             <- project-specific
    CompanyRepo2             <- project-specific
  SideProjects (project)     <- independent project
  Documents (project)        <- independent project
```

Scope turunan mewarisi memory, skill, dan MCP server dari parent scope.

## cara kerjanya

1. **Memindai** `~/.claude/` — menemukan semua project, memory, skill, MCP server, hook, plugin, dan plan
2. **Menentukan hierarki scope** — memetakan relasi parent-child dari path filesystem
3. **Merender dashboard** — header scope > bar kategori > baris item, dengan indentasi yang tepat
4. **Menangani perpindahan** — saat Anda drag item atau mengklik "Move to...", file di disk benar-benar dipindahkan dengan safety check

## perbandingan

Kami meninjau semua tool config Claude Code yang bisa kami temukan. Tidak ada satu pun yang menawarkan hierarki scope visual plus perpindahan lintas-scope via drag-and-drop dalam dashboard standalone.

| Yang saya butuhkan | Desktop app (600+⭐) | VS Code extension | Full-stack web app | **Claude Code Organizer** |
|---------|:---:|:---:|:---:|:---:|
| Tree hierarki scope | No | Yes | Partial | **Yes** |
| Perpindahan drag-and-drop | No | No | No | **Yes** |
| Perpindahan lintas-scope | No | One-click | No | **Yes** |
| Hapus item usang | No | No | No | **Yes** |
| Tool MCP | No | No | Yes | **Yes** |
| Zero dependencies | No (Tauri) | No (VS Code) | No (React+Rust+SQLite) | **Yes** |
| Standalone (tanpa IDE) | Yes | No | Yes | **Yes** |

## dukungan platform

| Platform | Status |
|----------|:------:|
| Ubuntu / Linux | Didukung |
| macOS (Intel + Apple Silicon) | Didukung (sudah diuji komunitas di Sequoia M3) |
| Windows | Belum |
| WSL | Seharusnya bisa jalan (belum diuji) |

## struktur project

```
src/
  scanner.mjs       # Scans ~/.claude/ — pure data, no side effects
  mover.mjs         # Moves files between scopes — safety checks + rollback
  server.mjs        # HTTP server — routes only, no logic
  ui/
    index.html       # HTML structure
    style.css        # All styling (edit freely, won't break logic)
    app.js           # Frontend rendering + SortableJS + interactions
bin/
  cli.mjs            # Entry point
```

Frontend dan backend dipisahkan sepenuhnya. Anda bisa mengubah tampilan lewat file di `src/ui/` tanpa menyentuh logic apa pun.

## API

Dashboard ini berjalan di atas REST API:

| Endpoint | Method | Deskripsi |
|----------|--------|-------------|
| `/api/scan` | GET | Scan semua kustomisasi, lalu mengembalikan scope + item + count |
| `/api/move` | POST | Memindahkan item ke scope lain (mendukung disambiguasi kategori/nama) |
| `/api/delete` | POST | Menghapus item secara permanen |
| `/api/restore` | POST | Memulihkan file yang sudah dihapus (untuk undo) |
| `/api/restore-mcp` | POST | Memulihkan entri MCP server yang dihapus |
| `/api/destinations` | GET | Mengambil tujuan perpindahan yang valid untuk sebuah item |
| `/api/file-content` | GET | Membaca isi file untuk detail panel |

## lisensi

MIT

## proyek lain dari @mcpware

| Project | Apa fungsinya | Install |
|---------|---|---|
| **[Instagram MCP](https://github.com/mcpware/instagram-mcp)** | 23 tool Instagram Graph API — posts, comments, DMs, stories, analytics | `npx @mcpware/instagram-mcp` |
| **[UI Annotator](https://github.com/mcpware/ui-annotator-mcp)** | Label hover di halaman web mana pun — AI mereferensikan elemen berdasarkan nama | `npx @mcpware/ui-annotator` |
| **[Pagecast](https://github.com/mcpware/pagecast)** | Rekam sesi browser sebagai GIF atau video lewat MCP | `npx @mcpware/pagecast` |
| **[LogoLoom](https://github.com/mcpware/logoloom)** | Desain logo dengan AI → SVG → ekspor brand kit lengkap | `npx @mcpware/logoloom` |

## penulis

[ithiria894](https://github.com/ithiria894) — Membangun tool untuk ekosistem Claude Code.
