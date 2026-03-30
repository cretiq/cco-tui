# cco-tui — TUI Port of Claude Code Organizer

**Date:** 2026-03-30
**Status:** Design approved

## Overview

Fork of [mcpware/claude-code-organizer](https://github.com/mcpware/claude-code-organizer) (CCO) that replaces the browser-based web dashboard with a terminal user interface (TUI). The TUI faithfully ports the original's three-panel layout, interaction model, and feature set while adapting UX patterns for keyboard-driven terminal use.

**Name:** `cco-tui`
**Stack:** Node.js (ESM), Ink (React for CLI)
**Architecture:** Thin wrapper — fork CCO, replace `src/ui/` and `src/server.mjs` with Ink components that import core modules directly.

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Move operations | Menu-based destination picker modal | Matches original's move confirmation UX; most discoverable for terminal |
| Theming | Inherit terminal colors (ANSI) | CLI tool for CLI users — respect their terminal config |
| Output modes | TUI default + `--json` flag | TUI is the product; JSON makes it composable for scripting/CI |
| Sidebar | All categories, collapsible tree | Faithful to original; collapsing handles vertical space |
| Framework | Ink (Node.js) | Reuses all core modules directly; fastest path to ship |
| Architecture | Thin wrapper (direct imports) | Simplest, no HTTP overhead, single process |

## Layout

Three-panel flexbox layout mapped to terminal columns:

```
┌─────────────────────┬──────────────────────────────────────────┬──────────────────────────────┐
│ Sidebar (~22 cols)  │ Main Panel (flexible)                    │ Detail Panel (~32 cols)      │
│                     │                                          │                              │
│ Scope tree with     │ Filter bar (pill toggles)                │ Item metadata (size, dates,  │
│ collapsible nodes,  │ Search input                             │ path, token count)           │
│ category counts,    │ Items grouped by category                │                              │
│ color-coded badges  │ with collapsible headers                 │ File content preview         │
│                     │                                          │ (monospace, scrollable)       │
│                     │ OR: Budget view (bar charts)             │                              │
│                     │ OR: Security scan (findings list)        │ OR: Budget summary           │
│                     │ OR: Session preview (full-width chat)    │ OR: Finding detail           │
├─────────────────────┴──────────────────────────────────────────┴──────────────────────────────┤
│ Bottom bar: context-sensitive keyboard shortcuts                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

Panel sizing:
- Sidebar: fixed ~22 columns
- Detail: fixed ~32 columns
- Main: fills remaining width
- Minimum terminal width: ~80 columns (sidebar hidden below minimum, toggle with `Tab`)
- Bottom bar: 1 row, always visible

## Views

### 1. Main Dashboard (default)

- **Sidebar:** Hierarchical scope tree — Global / Workspace / Project. Each scope lists categories (Memories, Skills, MCP Servers, Commands, Agents, Rules, Plans, Sessions, Config, Hooks, Plugins) with item counts. Collapsible with `Enter`.
- **Main panel:** Items grouped by category with collapsible headers. Each item shows name, size, date, scope/category badge. Filter pills at top toggle category visibility.
- **Detail panel:** Empty state until item selected. On selection: metadata section (size, created, modified, path, token count) and scrollable content preview.

### 2. Context Budget View (key: `b`)

- **Main panel:** Replaces item list. Shows "Always loaded" and "Deferred" sections with horizontal bar charts (`█` blocks) and token counts. Window size toggle (200K / 1M). Sortable by tokens, name, or scope.
- **Detail panel:** Token allocation summary with visual breakdown bar, legend, and window stats.

### 3. Security Scan View (key: `s`)

- **Main panel:** Replaces item list. Findings grouped by severity (Critical / Medium / Info) with colored markers (`✗` / `⚠` / `ℹ`). Severity filter pills. Shows scan stats (items scanned, duration).
- **Detail panel:** Selected finding detail — file path, scope, threat description, deobfuscated content preview. Action: delete item or view full file.

### 4. Session Preview

- Triggered by pressing `Enter` on a session item.
- **Expands to full width** (main + detail panels merged). Chat-style layout with colored role indicators (`┃ Human` blue, `┃ Assistant` green). Scrollable with `↑/↓` and `PgUp/PgDn`.

## Modals

### Move Destination Picker

- Triggered by `m` on selected item(s).
- Centered overlay with title showing item name.
- Filterable list of valid destination scopes.
- Keys: `↑/↓` navigate, `Enter` confirm, `Esc` cancel.

### Delete Confirmation

- Triggered by `d` on selected item(s).
- Compact centered overlay with item name, scope, warning text.
- Two buttons: `[Delete]` (destructive styling) and `[Cancel]`.
- Keys: `Tab` switch buttons, `Enter` confirm, `Esc` cancel.

### Help Modal

- Triggered by `?`.
- Full keybinding reference organized by context (global, panel, modal).

## Bulk Selection Mode

- Toggle with `v`. Header shows "BULK MODE — N selected".
- `Space` toggles item checkbox (`[✓]` / `[ ]`).
- Detail panel shows selection summary and available bulk actions.
- `m` / `d` operate on all selected items.
- `Esc` exits bulk mode and clears selection.

## Toast Notifications

- Bottom-right overlay, auto-dismiss after 3 seconds.
- Shows success/error messages for move/delete operations.
- Includes `[Undo]` action for reversible operations (leverages `history.mjs`).

## Keyboard Navigation

### Global Keys (always available)

| Key | Action |
|---|---|
| `q` | Quit |
| `?` | Help modal |
| `b` | Budget view |
| `s` | Security scan |
| `/` | Focus search input |
| `Tab` | Next panel |
| `Shift+Tab` | Previous panel |

### Panel Keys (active panel only)

| Key | Action |
|---|---|
| `k` / `↑` | Navigate up |
| `j` / `↓` | Navigate down |
| `Enter` | Select / expand / collapse |
| `m` | Move selected item(s) |
| `d` | Delete selected item(s) |
| `v` | Toggle bulk selection mode |
| `Space` | Toggle item checkbox (bulk mode) |

### Modal Keys

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate options |
| `Tab` | Switch buttons |
| `Enter` | Confirm |
| `Esc` | Cancel / close |

Focus order: Sidebar → Items → Detail. Active panel indicated by brighter border. Modals capture all keyboard input until dismissed.

## Component Architecture

```
App
├── Layout (flex container, 3 panels)
│   ├── Sidebar
│   │   ├── ScopeTree (collapsible, navigable)
│   │   └── ScopeNode (recursive, shows category counts)
│   ├── MainPanel
│   │   ├── FilterBar (pill toggles)
│   │   ├── SearchInput
│   │   ├── ItemList (grouped by category)
│   │   │   ├── CategoryHeader (collapsible)
│   │   │   └── ItemRow (name, size, date, scope badge)
│   │   ├── BudgetView (bar charts, token breakdown)
│   │   ├── SecurityView (findings list, severity filter)
│   │   └── SessionPreview (chat-style JSONL viewer)
│   └── DetailPanel
│       ├── ItemDetail (metadata + preview)
│       ├── BudgetDetail (allocation summary)
│       ├── SecurityDetail (threat info, deobfuscated content)
│       └── BulkSummary (selected items, actions)
├── MoveModal (destination picker)
├── DeleteModal (confirmation)
├── HelpModal (keybinding reference)
└── Toast (undo notifications, auto-dismiss)
```

## State Management

Single `useReducer` with actions:

| Action | Effect |
|---|---|
| `SCAN_COMPLETE` | Populate scopes and items from scanner results |
| `SET_SCOPE` / `SET_CATEGORY` | Sidebar navigation state |
| `SELECT_ITEM` / `TOGGLE_BULK` | Item selection (single and multi) |
| `SET_VIEW` | Switch between items / budget / security / session |
| `SET_FILTER` / `SET_SEARCH` | Category filter toggles and search text |
| `MOVE_ITEM` / `DELETE_ITEM` | Mutations with undo stack via history.mjs |
| `SET_FOCUS` | Track which panel has keyboard focus |
| `SHOW_MODAL` / `HIDE_MODAL` | Modal visibility |
| `SHOW_TOAST` / `HIDE_TOAST` | Toast notifications |

## Data Flow

```
CLI entry (bin/cli.mjs)
  → parse args (--json, --scan-dir)
  → if --json subcommand: run scanner/audit/budget, print JSON, exit
  → else: mount Ink <App />
    → scanner.mjs scans all scopes on mount
    → dispatch SCAN_COMPLETE with results
    → user navigates and acts via keyboard
    → mover.mjs handles move/delete mutations
    → history.mjs tracks undo stack
    → security-scanner.mjs runs on demand (when user opens security view)
    → tokenizer.mjs computes budget on demand (when user opens budget view)
```

## CLI Interface

```
cco-tui                       # launch TUI (default)
cco-tui --scan-dir ~/other    # scan a different directory
cco-tui scan --json           # dump full inventory as JSON to stdout
cco-tui audit --json          # security scan results as JSON
cco-tui budget --json         # token budget breakdown as JSON
```

## Files Changed from Upstream

### Removed
- `src/server.mjs` — HTTP server, SSE heartbeat, REST API (replaced by direct module calls)
- `src/ui/index.html` — browser SPA shell
- `src/ui/app.js` — browser frontend logic
- `src/ui/style.css` — browser styles

### Kept (unchanged or minimal edits)
- `src/scanner.mjs` — core scanning engine
- `src/security-scanner.mjs` — 4-layer security analysis
- `src/tokenizer.mjs` — token counting
- `src/mover.mjs` — move/delete operations
- `src/history.mjs` — undo/restore support
- `src/mcp-server.mjs` — MCP server mode (unchanged)
- `src/mcp-introspector.mjs` — MCP tool introspection

### Added
- `src/tui/App.jsx` — root Ink component
- `src/tui/Layout.jsx` — three-panel flex container
- `src/tui/Sidebar.jsx` — scope tree with navigation
- `src/tui/MainPanel.jsx` — item list, budget, security, session views
- `src/tui/DetailPanel.jsx` — metadata, preview, finding detail
- `src/tui/FilterBar.jsx` — category pill toggles
- `src/tui/ItemList.jsx` — grouped item display
- `src/tui/BudgetView.jsx` — token budget bar charts
- `src/tui/SecurityView.jsx` — security findings list
- `src/tui/SessionPreview.jsx` — JSONL chat viewer
- `src/tui/MoveModal.jsx` — destination picker overlay
- `src/tui/DeleteModal.jsx` — delete confirmation overlay
- `src/tui/HelpModal.jsx` — keybinding reference
- `src/tui/Toast.jsx` — notification component
- `src/tui/store.js` — useReducer state management
- `src/tui/hooks/useKeyboard.js` — keyboard input handling
- `src/tui/hooks/useFocus.js` — panel focus management

### Modified
- `bin/cli.mjs` — replace browser launch with Ink render, add `--json` subcommands
- `package.json` — add ink, ink-testing-library, react deps; update name/description

## Dependencies Added

| Package | Purpose |
|---|---|
| `ink` | React renderer for terminal |
| `react` | Component framework (Ink peer dep) |
| `ink-text-input` | Search input component |
| `ink-select-input` | List selection (move modal) |
| `ink-spinner` | Loading states during scan |
| `ink-testing-library` | Test utilities (dev dep) |

## Testing Strategy

- **Unit tests:** State reducer — verify all actions produce correct state transitions.
- **Component tests:** Ink testing library — render components, simulate keyboard input, assert output.
- **Integration tests:** Full app render with mock scanner data, verify navigation flow.
- **Existing Playwright tests:** Remove (browser-specific). Replace with equivalent Ink tests.
