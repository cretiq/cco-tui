# Claude Code Organizer

[![npm version](https://img.shields.io/npm/v/@mcpware/claude-code-organizer)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![npm downloads](https://img.shields.io/npm/dt/@mcpware/claude-code-organizer?label=downloads)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![GitHub stars](https://img.shields.io/github/stars/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Bahasa Indonesia](README.id.md) | [Italiano](README.it.md) | [Português](README.pt-BR.md) | [Türkçe](README.tr.md) | [Tiếng Việt](README.vi.md) | ไทย

**จัดระเบียบ memories, skills, MCP servers และ hooks ของ Claude Code ทั้งหมดในที่เดียว ดูตาม scope hierarchy และย้ายข้าม scope ด้วย drag-and-drop**

![Claude Code Organizer Demo](docs/demo.gif)

## ปัญหา

Claude Code จะสร้าง memories, skills และ MCP configs แบบเงียบ ๆ ทุกครั้งที่คุณทำงาน แล้วโยนทุกอย่างลง scope ที่ตรงกับ directory ปัจจุบัน สิ่งที่คุณตั้งใจให้มีผลทุกที่? กลับติดอยู่ใน Project เดียว deploy skill ที่ควรอยู่กับ repo เดียว? ดันหลุดไปอยู่ใน Global แล้วไปปนกับทุก Project อื่น

**ปัญหานี้ไม่ได้แค่ทำให้รก แต่มันลดประสิทธิภาพ AI ของคุณด้วย** ทุก session Claude จะโหลด config ทั้งหมดจาก scope ปัจจุบัน รวมถึงทุกอย่างที่สืบทอดมาจาก scope แม่ เข้าไปใน context window item ที่อยู่ผิด scope จึงเท่ากับเปลือง token, ทำให้ context ปนเปื้อน และลดความแม่นยำ skill สำหรับ Python pipeline ที่ค้างอยู่ใน Global จะถูกโหลดแม้คุณกำลังทำ React frontend อยู่ MCP entry ที่ซ้ำกันอาจทำให้ server เดิมถูก initialize ซ้ำสองครั้ง ส่วน memory เก่าก็อาจขัดกับคำสั่งล่าสุดของคุณ

### "แค่บอกให้ Claude จัดการก็พอ"

คุณจะให้ Claude Code จัดการ config ของตัวเองก็ได้ แต่สุดท้ายก็ต้องคุยไปกลับกันหลายรอบ `ls` ทีละ directory, `cat` ทีละไฟล์ แล้วค่อย ๆ ปะติดปะต่อภาพรวมจาก output ที่แยกเป็นชิ้น ๆ **ไม่มีคำสั่งไหนที่ทำให้เห็น tree ทั้งหมดได้ในทีเดียว** ครบทุก scope ทุก item และทุกชั้นของการสืบทอด

### ทางออก: dashboard ที่เห็นภาพรวม

```bash
npx @mcpware/claude-code-organizer
```

สั่งครั้งเดียว แล้วคุณจะเห็นทุกอย่างที่ Claude เก็บไว้ โดยจัดเรียงตาม scope hierarchy **ลาก item ข้าม scope ได้ทันที** ลบ memory เก่าที่ไม่ใช้แล้ว หา item ซ้ำ และควบคุมได้จริงว่าอะไรบ้างที่กำลังมีผลต่อพฤติกรรมของ Claude

### ตัวอย่าง: Project → Global

คุณบอก Claude ว่า "I prefer TypeScript + ESM" ตอนอยู่ใน Project หนึ่ง แต่ preference แบบนี้ควรมีผลทุกที่ แค่เปิด dashboard แล้วลาก memory นั้นจาก Project ไป Global **ลากครั้งเดียวจบ**

### ตัวอย่าง: Global → Project

deploy skill ที่อยู่ใน Global แต่จริง ๆ ใช้กับ repo เดียว ก็แค่ลากไปไว้ใน Project scope นั้น เท่านี้ Project อื่นก็จะไม่เห็นมันอีก

### ตัวอย่าง: ลบ memory ที่ไม่อัปเดตแล้ว

Claude อาจสร้าง memory ให้อัตโนมัติจากสิ่งที่คุณพูดเล่น ๆ หรือจากสิ่งที่มันคิดว่าควรจำไว้ ผ่านไปหนึ่งสัปดาห์สิ่งนั้นอาจไม่เกี่ยวแล้ว แต่ก็ยังถูกโหลดอยู่ทุก session เปิดดู อ่าน แล้วลบได้ทันที **คุณเป็นคนกำหนดเองว่า Claude ควรรู้อะไรเกี่ยวกับคุณ**

---

## ฟีเจอร์

- **เห็นตาม scope hierarchy** — item ทั้งหมดถูกจัดเป็น Global > Workspace > Project พร้อมตัวบอกการสืบทอด
- **Drag-and-drop** — ย้าย memories ข้าม scope, ย้าย skills ระหว่าง Global กับ per-repo, ย้าย MCP servers ข้าม config
- **ยืนยันก่อนย้าย** — ทุกครั้งที่ย้าย จะมี modal ให้ยืนยันก่อนแตะไฟล์จริง
- **กันย้ายผิดประเภท** — items แต่ละประเภทย้ายได้เฉพาะปลายทางของประเภทตัวเอง: memories ไป folder ของ Memory, skills ไป folder ของ Skills, MCP ไป MCP config
- **Search & filter** — ค้นหาทุก item ได้ทันที และกรองตามหมวดหมู่ (Memory, Skills, MCP, Config, Hooks, Plugins, Plans)
- **detail panel** — คลิก item ไหนก็ได้เพื่อดู metadata แบบเต็ม, description, file path และเปิดใน VS Code
- **สแกนครบทุก Project** — ทุก scope จะแสดง item ทุกประเภท: memories, skills, MCP servers, configs, hooks และ plans
- **ย้ายไฟล์จริง** — ย้ายไฟล์ใน `~/.claude/` จริง ไม่ใช่แค่ viewer
- **45 E2E tests** — ชุดทดสอบ Playwright ที่ตรวจ filesystem จริงหลังทุก operation

## ทำไมต้องใช้ dashboard แบบภาพรวม?

Claude Code ดูและย้ายไฟล์ผ่าน CLI ได้ก็จริง แต่เวลาไล่ดู config ของตัวเอง คุณต้องคอยถามทีละข้อ เช็กทีละจุด แล้วค่อยปะติดปะต่อเอาเอง dashboard นี้ทำให้เห็น **ทุกอย่างได้ในจอเดียว:**

| สิ่งที่ต้องการ | ถาม Claude | Visual Dashboard |
|---------------|:-----------:|:----------------:|
| **เห็นทุกอย่างพร้อมกัน** ครบทุก scope | `ls` ทีละ directory แล้วค่อยปะติดปะต่อเอง | เห็นเป็น scope tree ในจอเดียว |
| **Project นี้กำลังโหลดอะไรอยู่บ้าง?** | ต้องรันหลายคำสั่งและหวังว่าไม่ตกหล่น | เปิด Project แล้วเห็น inheritance chain ครบ |
| **ย้าย item ข้าม scope** | หา path ที่ encode ไว้แล้ว `mv` เอง | Drag-and-drop พร้อม confirmation |
| **อ่านเนื้อหา config** | `cat` ทีละไฟล์ | คลิก → side panel |
| **หา item ซ้ำ / item ที่ไม่อัปเดตแล้ว** | `grep` ข้าม directory ชื่ออ่านยาก | Search + filter ตามหมวดหมู่ |
| **ล้าง memory ที่ไม่ได้ใช้แล้ว** | ต้องไล่หาว่าไฟล์ไหนควรลบ | เปิดดู อ่าน แล้วลบได้เลย |

## เริ่มต้นใช้งาน

### วิธีที่ 1: ใช้ npx (ไม่ต้อง install)

```bash
npx @mcpware/claude-code-organizer
```

### วิธีที่ 2: ติดตั้งแบบ global

```bash
npm install -g @mcpware/claude-code-organizer
claude-code-organizer
```

### วิธีที่ 3: ให้ Claude รันให้

วางข้อความนี้ใน Claude Code:

> Run `npx @mcpware/claude-code-organizer` — it's a dashboard for managing Claude Code settings. Tell me the URL when it's ready.

เมื่อรันแล้ว dashboard จะเปิดที่ `http://localhost:3847` และทำงานกับ `~/.claude/` จริงของคุณ

## สิ่งที่จัดการได้

| ประเภท | ดูได้ | ย้ายได้ | สแกนที่ | ทำไมถึงล็อก? |
|------|:----:|:----:|:----------:|-------------|
| Memories (feedback, user, project, reference) | ได้ | ได้ | Global + Project | — |
| Skills | ได้ | ได้ | Global + Project | — |
| MCP Servers | ได้ | ได้ | Global + Project | — |
| Config (CLAUDE.md, settings.json) | ได้ | ล็อก | Global + Project | เป็น system settings ถ้าย้ายอาจทำให้ config พัง |
| Hooks | ได้ | ล็อก | Global + Project | ผูกกับ settings context ถ้าย้ายผิดที่อาจ fail แบบเงียบ ๆ |
| Plans | ได้ | ได้ | Global + Project | — |
| Plugins | ได้ | ล็อก | Global only | cache ที่ Claude Code จัดการเอง |

## ลำดับชั้นของ scope

```
Global                       <- applies everywhere
  Company (workspace)        <- applies to all sub-projects
    CompanyRepo1             <- project-specific
    CompanyRepo2             <- project-specific
  SideProjects (project)     <- independent project
  Documents (project)        <- independent project
```

scope ลูกจะได้รับ memories, skills และ MCP servers จาก scope แม่โดยอัตโนมัติ

## วิธีการทำงาน

1. **สแกน** `~/.claude/` — ค้นหา projects, memories, skills, MCP servers, hooks, plugins และ plans ทั้งหมด
2. **ระบุ scope hierarchy** — ระบุความสัมพันธ์แบบ parent-child จาก filesystem paths
3. **เรนเดอร์ dashboard** — แสดง scope headers > category bars > item rows พร้อมระยะย่อหน้าให้ถูกต้อง
4. **จัดการการย้าย** — เมื่อคุณลากหรือคลิก "Move to..." ระบบจะย้ายไฟล์บน disk จริงพร้อม safety checks

## เปรียบเทียบ

เราไล่ดูเครื่องมือจัดการ config ของ Claude Code เท่าที่หาเจอ ยังไม่พบตัวไหนที่มีทั้ง scope hierarchy แบบมองเห็นภาพ และการย้ายข้าม scope ด้วย drag-and-drop ใน dashboard แบบ standalone

| สิ่งที่ต้องการ | Desktop app (600+⭐) | VS Code extension | Full-stack web app | **Claude Code Organizer** |
|---------|:---:|:---:|:---:|:---:|
| มี tree ของ scope hierarchy | ไม่มี | มี | บางส่วน | **มี** |
| ย้ายด้วย drag-and-drop | ไม่มี | ไม่มี | ไม่มี | **มี** |
| ย้ายข้าม scope | ไม่มี | คลิกครั้งเดียว | ไม่มี | **มี** |
| ลบ item ที่ไม่อัปเดตแล้ว | ไม่มี | ไม่มี | ไม่มี | **มี** |
| เครื่องมือ MCP | ไม่มี | ไม่มี | มี | **มี** |
| ไม่มี dependencies เพิ่ม | ไม่มี (Tauri) | ไม่มี (VS Code) | ไม่มี (React+Rust+SQLite) | **มี** |
| ใช้งาน standalone (ไม่ต้องมี IDE) | มี | ไม่มี | มี | **มี** |

## การรองรับแพลตฟอร์ม

| Platform | สถานะ |
|----------|:------:|
| Ubuntu / Linux | รองรับ |
| macOS (Intel + Apple Silicon) | รองรับ (มีคนใน community ทดสอบบน Sequoia M3 แล้ว) |
| Windows | ยังไม่รองรับ |
| WSL | น่าจะใช้ได้ (ยังไม่ทดสอบ) |

## โครงสร้าง project

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

Frontend กับ backend แยกจากกันชัดเจน ถ้าอยากปรับหน้าตา ให้แก้ไฟล์ใน `src/ui/` ได้เลยโดยไม่ต้องแตะ logic

## API

dashboard ตัวนี้มี REST API รองรับอยู่ด้านหลัง:

| Endpoint | Method | คำอธิบาย |
|----------|--------|-------------|
| `/api/scan` | GET | สแกน customizations ทั้งหมด แล้วคืน scopes + items + counts |
| `/api/move` | POST | ย้าย item ไปยัง scope อื่น (รองรับการแยกกรณี category/name ซ้ำกัน) |
| `/api/delete` | POST | ลบ item ถาวร |
| `/api/restore` | POST | กู้คืนไฟล์ที่ลบไป (ใช้สำหรับ undo) |
| `/api/restore-mcp` | POST | กู้คืน MCP server entry ที่ลบไป |
| `/api/destinations` | GET | ดึงปลายทางที่ย้ายไปได้สำหรับ item |
| `/api/file-content` | GET | อ่านเนื้อหาไฟล์เพื่อใช้ใน detail panel |

## สัญญาอนุญาต

MIT

## โปรเจกต์อื่นจาก @mcpware

| Project | ทำอะไร | Install |
|---------|---|---|
| **[Instagram MCP](https://github.com/mcpware/instagram-mcp)** | เครื่องมือ Instagram Graph API 23 ตัว — posts, comments, DMs, stories, analytics | `npx @mcpware/instagram-mcp` |
| **[UI Annotator](https://github.com/mcpware/ui-annotator-mcp)** | แสดงป้ายชื่อเวลา hover บนเว็บเพจใดก็ได้ — ให้ AI อ้างอิง element ตามชื่อ | `npx @mcpware/ui-annotator` |
| **[Pagecast](https://github.com/mcpware/pagecast)** | บันทึก browser sessions เป็น GIF หรือวิดีโอผ่าน MCP | `npx @mcpware/pagecast` |
| **[LogoLoom](https://github.com/mcpware/logoloom)** | ออกแบบโลโก้ด้วย AI → SVG → export brand kit ได้ครบชุด | `npx @mcpware/logoloom` |

## ผู้เขียน

[ithiria894](https://github.com/ithiria894) — พัฒนาเครื่องมือสำหรับ ecosystem ของ Claude Code.
