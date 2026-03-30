---
name: ink-terminal-ui
description: "cco-tui Ink/React TUI architecture — components, state, hooks, patterns, scope groups, category metadata. Use when user mentions TUI, sidebar, item list, detail panel, layout, Ink component, useListNavigation, store reducer, scope tree, category icons, nerd font, budget view, security view, session preview, modal, toast, filter bar, bottom bar."
---

# cco-tui Terminal UI Architecture

## Stack
- Ink 6.8.0 + React 19 (JSX, useReducer, useMemo, useInput)
- @inkjs/ui (TextInput)
- Vitest + ink-testing-library for tests
- esbuild for JSX transpilation
- Requires JetBrainsMono Nerd Font for codicon icons

## Entry Points
- `npm run dev` — tsx/esm loader (development)
- `npm run build && npm start` — esbuild transpile then run
- `npm run mcp` — MCP server mode (stdio JSON-RPC)

## Component Tree
```
App.jsx (useReducer + scan on mount)
  └─ Layout.jsx (3-panel responsive, round borders)
       ├─ Sidebar.jsx (scope tree + category browser + scope groups)
       ├─ Main panel (switches by state.view):
       │   ├─ ItemList.jsx (filtered items grouped by category)
       │   ├─ BudgetView.jsx (token accounting)
       │   ├─ SecurityView.jsx (security findings)
       │   └─ SessionPreview.jsx (JSONL viewer)
       ├─ DetailPanel.jsx (file preview + metadata)
       ├─ Modals: MoveModal, DeleteModal, HelpModal
       ├─ SearchInput.jsx (TextInput wrapper)
       ├─ FilterBar.jsx (category toggles)
       ├─ BottomBar.jsx (context-aware keybinds)
       └─ Toast.jsx (auto-dismiss)
```

## State Management
Single `useReducer` in App.jsx. Key state fields:
- `scopes[]`, `items[]`, `counts{}` — from scanner
- `selectedScopeId`, `selectedItemPath` — current selection
- `view` — 'items' | 'budget' | 'security' | 'session'
- `focus` — 'sidebar' | 'main' | 'detail'
- `filters[]`, `search`, `bulk`, `bulkSelected`, `modal`, `toast`

Actions: SCAN_COMPLETE, SET_SCOPE, SELECT_ITEM, SET_VIEW, SET_FILTER, SET_SEARCH, SET_FOCUS, TOGGLE_BULK, BULK_TOGGLE_ITEM, SHOW_MODAL, HIDE_MODAL, SHOW_TOAST, HIDE_TOAST, REMOVE_ITEM, UPDATE_ITEM_SCOPE, START_SEARCH, STOP_SEARCH

## Shared Modules
- `categoryMeta.js` — CATEGORY_COLORS + CATEGORY_ICONS (Nerd Font codicon codepoints). Single source of truth, imported by Sidebar + ItemList.
- `keymaps.js` — KEYS object (hjkl defaults or custom), keymapMode
- `selectors.js` — getVisibleItems, getItemsByCategory, getScopeTree, getSelectedItem (all pure, memoizable)
- `store.js` — initialState + reducer

## Hooks
- `useListNavigation(items, { isActive, onSelect })` → `{ cursor, setCursor, handleInput, currentItem }` — arrow/hjkl cursor, Enter to select. Used by Sidebar, ItemList, BudgetView, SecurityView, MoveModal.
- `usePanelFocus(state, dispatch)` → `{ focusNext, focusPrev }` — Tab/Shift+Tab cycling
- `useTerminalSize()` → `{ columns, rows }` — responsive layout

## Sidebar Scope Groups
Scopes are grouped at the top level by `SCOPE_GROUPS` patterns:
```javascript
const SCOPE_GROUPS = [
  { id: 'phoenix', name: 'Phoenix', match: /^(p[1-5]|m5)$/ },
];
```
Global scope stays ungrouped at top. Non-matching scopes go into "Projects" group. Groups are collapsible with Enter or arrow keys. `buildFlatList()` produces a flat array with `type: 'scope' | 'category' | 'group'` entries + `indent` for nesting.

## Layout Conventions
- Sidebar: 38 cols (visible if terminal ≥ 60 cols)
- Detail: 34 cols (visible if terminal ≥ 100 cols)
- Border: `borderStyle="round"`, focus color `#86efac`, unfocused `gray`
- Indent via `<Box marginLeft={n}>` (not string padding)

## Nerd Font Icons
Codicon codepoints in `categoryMeta.js` (e.g., `\uEA61` for lightbulb). Chevrons: `\uEB6E` (down) / `\uEB70` (right) for expand/collapse.

## Data Layer (non-UI)
- `scanner.mjs` — discovers all Claude Code configs across `~/.claude/` + project scopes
- `mover.mjs` — moveItem / deleteItem between scopes (with cross-device fallback)
- `security-scanner.mjs` — 8 deobfuscation layers + 60+ regex patterns + hash baselines
- `mcp-introspector.mjs` — JSON-RPC 2.0 stdio client to introspect MCP server tools
- `history.mjs` — copy-on-write backup before mutations
- `tokenizer.mjs` — ai-tokenizer with bytes/4 fallback

## Testing
- `npm test` (vitest) — `src/tui/__tests__/`
- store.test.js: all reducer actions
- selectors.test.js: filtering, grouping, scope tree
- App.test.jsx: integration with ink-testing-library
- `tests/e2e/dashboard.spec.mjs`: Playwright for browser UI

## When Adding Components
1. Create in `src/tui/`, use `.jsx` extension
2. Accept `{ state, dispatch }` props
3. Use `useListNavigation` for keyboard nav
4. Import colors/icons from `categoryMeta.js`
5. Add view case in Layout.jsx if it's a new view
6. Add keyboard shortcut in App.jsx `useInput`
