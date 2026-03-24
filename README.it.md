# Claude Code Organizer

[![npm version](https://img.shields.io/npm/v/@mcpware/claude-code-organizer)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![npm downloads](https://img.shields.io/npm/dt/@mcpware/claude-code-organizer?label=downloads)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![GitHub stars](https://img.shields.io/github/stars/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Bahasa Indonesia](README.id.md) | Italiano | [Português](README.pt-BR.md) | [Türkçe](README.tr.md) | [Tiếng Việt](README.vi.md) | [ไทย](README.th.md)

**Organizza tutte le memory, le skill, i server MCP e gli hook di Claude Code: visualizzale per gerarchia di scope e spostale tra scope con il drag-and-drop.**

![Claude Code Organizer Demo](docs/demo.gif)

## Il problema

Claude Code crea in silenzio memory, skill e config MCP ogni volta che lavori e le salva nello scope che corrisponde alla directory in cui ti trovi. Una preferenza che volevi usare ovunque? Resta bloccata in un solo progetto. Una skill di deploy che ha senso solo per un repo? Finisce in Global e contamina tutti gli altri progetti.

**Non è solo disordine: peggiora anche le prestazioni della tua AI.** A ogni sessione, Claude carica tutte le config dello scope corrente insieme a tutto ciò che eredita dagli scope superiori. Elementi finiti nello scope sbagliato significano token sprecati, contesto inquinato e precisione più bassa. Una skill per una pipeline Python lasciata in Global viene caricata anche nella tua sessione frontend React. Voci MCP duplicate inizializzano due volte lo stesso server. Memory non più attuali possono contraddire le istruzioni che vuoi usare oggi.

### "Basta chiedere a Claude di sistemare tutto"

Potresti chiedere a Claude Code di gestire da solo la propria config. In pratica, però, finisci a saltare avanti e indietro: `ls` in una directory, `cat` su ogni file, poi provi a ricomporre il quadro partendo da frammenti di output testuale. **Non esiste un comando che mostri l'intero albero** di tutti gli scope, con tutti gli elementi e tutta l'ereditarietà, in una volta sola.

### La soluzione: una dashboard visiva

```bash
npx @mcpware/claude-code-organizer
```

Un solo comando. Vedi tutto quello che Claude ha salvato, organizzato per gerarchia di scope. **Sposta gli elementi tra scope con il drag-and-drop.** Elimina le memory obsolete. Individua i duplicati. Riprendi il controllo di ciò che influenza davvero il comportamento di Claude.

### Esempio: Project → Global

Hai detto a Claude "preferisco TypeScript + ESM" mentre eri dentro un progetto, ma quella preferenza ti serve ovunque. Apri la dashboard, trascina quella memory da Project a Global. **Fine. Un drag.**

### Esempio: Global → Project

Una skill di deploy lasciata in Global ha senso solo per un repo. Trascinala nello scope Project corretto: gli altri progetti non la vedranno più.

### Esempio: eliminare memory obsolete

Claude crea automaticamente memory a partire da cose dette al volo o da dettagli che *credeva* volessi ricordare. Dopo una settimana magari non servono più, ma continuano a essere caricate in ogni sessione. Sfoglia, leggi, elimina. **Decidi tu cosa Claude pensa di sapere su di te.**

---

## Funzionalità

- **Gerarchia degli scope**: tutti gli elementi sono organizzati come Global > Workspace > Project, con indicatori di ereditarietà
- **Drag-and-drop**: sposta memory tra scope, skill tra Global e singoli repo, server MCP tra config diverse
- **Finestra di conferma per gli spostamenti**: ogni spostamento apre una finestra di conferma prima di modificare qualsiasi file
- **Sicurezza per tipo**: le memory possono essere spostate solo in cartelle di memory, le skill solo in cartelle di skill, i server MCP solo in config MCP
- **Ricerca e filtro**: cerca subito tra tutti gli elementi e filtra per categoria (Memory, Skills, MCP, Config, Hooks, Plugins, Plans)
- **Pannello dettagli**: clicca un elemento per vedere metadati completi, descrizione, file path e aprirlo in VS Code
- **Scansione completa per progetto**: ogni scope mostra tutti i tipi di elementi: Memory, Skills, MCP, Config, Hooks e Plans
- **Spostamenti reali dei file**: sposta davvero i file in `~/.claude/`, non è solo un visualizzatore
- **45 test E2E**: suite Playwright con verifica del filesystem reale dopo ogni operazione

## Perché una dashboard visiva?

Claude Code sa già elencare e spostare file via CLI, ma con la sola CLI finisci per interrogare la tua config pezzo per pezzo. La dashboard ti dà **visibilità completa a colpo d'occhio:**

| Cosa ti serve | Con Claude | Dashboard visiva |
|---------------|:----------:|:----------------:|
| **Vedere tutto insieme** tra tutti gli scope | `ls` una directory alla volta, poi ricostruisci il quadro | Albero degli scope, subito |
| **Cosa viene caricato nel progetto attuale?** | Devi eseguire più comandi e sperare di non perderti niente | Apri il Project → vedi tutta la catena di ereditarietà |
| **Spostare elementi tra scope** | Devi trovare i path codificati e usare `mv` a mano | Drag-and-drop con finestra di conferma |
| **Leggere il contenuto di una config** | `cat` file per file | Clic → pannello laterale |
| **Trovare duplicati o elementi obsoleti** | `grep` in directory poco leggibili | Ricerca + filtro per categoria |
| **Ripulire memory inutilizzate** | Devi capire da solo quali file eliminare | Sfoglia, leggi, elimina sul posto |

## Avvio rapido

### Opzione 1: npx (nessuna installazione necessaria)

```bash
npx @mcpware/claude-code-organizer
```

### Opzione 2: installazione globale

```bash
npm install -g @mcpware/claude-code-organizer
claude-code-organizer
```

### Opzione 3: chiedilo a Claude

Incolla questo messaggio in Claude Code:

> Esegui `npx @mcpware/claude-code-organizer` - è una dashboard per gestire le impostazioni di Claude Code. Dimmi l'URL quando è pronto.

Si apre una dashboard su `http://localhost:3847`. Funziona con la tua directory `~/.claude/` reale.

## Cosa gestisce

| Tipo | Visualizza | Sposta | Scansionato in | Perché è bloccato? |
|------|:----------:|:------:|:--------------:|--------------------|
| Memory (feedback, user, project, reference) | Sì | Sì | Global + Project | - |
| Skills | Sì | Sì | Global + Project | - |
| Server MCP | Sì | Sì | Global + Project | - |
| Config (CLAUDE.md, settings.json) | Sì | Bloccato | Global + Project | Sono impostazioni di sistema: spostarle potrebbe rompere la config |
| Hooks | Sì | Bloccato | Global + Project | Dipendono dal contesto delle impostazioni: se li sposti puoi avere errori silenziosi |
| Plans | Sì | Sì | Global + Project | - |
| Plugins | Sì | Bloccato | Solo Global | Cache gestita da Claude Code |

## Gerarchia degli scope

```
Global                       <- applies everywhere
  Company (workspace)        <- applies to all sub-projects
    CompanyRepo1             <- project-specific
    CompanyRepo2             <- project-specific
  SideProjects (project)     <- independent project
  Documents (project)        <- independent project
```

Gli scope figli ereditano memory, skill e server MCP dallo scope padre.

## Come funziona

1. **Scansiona** `~/.claude/` - individua tutti i progetti, le memory, le skill, i server MCP, gli hook, i plugin e i plan
2. **Determina la gerarchia degli scope** - ricava le relazioni padre-figlio dai path del filesystem
3. **Renderizza la dashboard** - intestazioni degli scope > barre di categoria > righe degli elementi, con l'indentazione corretta
4. **Gestisce gli spostamenti** - quando trascini un elemento o fai clic su "Move to...", sposta davvero i file su disco con controlli di sicurezza

## Confronto

Abbiamo passato in rassegna tutti gli strumenti per la config di Claude Code che siamo riusciti a trovare. Nessuno offriva una gerarchia visiva degli scope più spostamenti tra scope via drag-and-drop in una dashboard standalone.

| Cosa mi serviva | App desktop (600+⭐) | Estensione VS Code | Web app full-stack | **Claude Code Organizer** |
|---------|:---:|:---:|:---:|:---:|
| Albero degli scope | No | Sì | Parziale | **Sì** |
| Spostamenti via drag-and-drop | No | No | No | **Sì** |
| Spostamenti tra scope | No | Con un clic | No | **Sì** |
| Eliminare elementi obsoleti | No | No | No | **Sì** |
| Tool MCP | No | No | Sì | **Sì** |
| Zero dipendenze | No (Tauri) | No (VS Code) | No (React+Rust+SQLite) | **Sì** |
| Standalone (senza IDE) | Sì | No | Sì | **Sì** |

## Supporto delle piattaforme

| Piattaforma | Stato |
|----------|:------:|
| Ubuntu / Linux | Supportato |
| macOS (Intel + Apple Silicon) | Supportato (testato dalla community su Sequoia M3) |
| Windows | Non ancora |
| WSL | Dovrebbe funzionare (non testato) |

## Struttura del progetto

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

Frontend e backend sono completamente separati. Per cambiare l'aspetto senza toccare la logica, intervieni sui file in `src/ui/`.

## API

La dashboard espone una REST API:

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/scan` | GET | Scansiona tutte le personalizzazioni e restituisce scope, elementi e conteggi |
| `/api/move` | POST | Sposta un elemento in uno scope diverso (con supporto alla disambiguazione categoria/nome) |
| `/api/delete` | POST | Elimina definitivamente un elemento |
| `/api/restore` | POST | Ripristina un file eliminato (per l'undo) |
| `/api/restore-mcp` | POST | Ripristina una voce di server MCP eliminata |
| `/api/destinations` | GET | Restituisce le destinazioni valide per spostare un elemento |
| `/api/file-content` | GET | Legge il contenuto del file per il pannello dettagli |

## Licenza

MIT

## Altri progetti di @mcpware

| Progetto | Cosa fa | Installazione |
|---------|---|---|
| **[Instagram MCP](https://github.com/mcpware/instagram-mcp)** | 23 tool della Instagram Graph API - post, commenti, DM, storie, analytics | `npx @mcpware/instagram-mcp` |
| **[UI Annotator](https://github.com/mcpware/ui-annotator-mcp)** | Etichette hover su qualsiasi pagina web - l'AI fa riferimento agli elementi per nome | `npx @mcpware/ui-annotator` |
| **[Pagecast](https://github.com/mcpware/pagecast)** | Registra sessioni del browser come GIF o video via MCP | `npx @mcpware/pagecast` |
| **[LogoLoom](https://github.com/mcpware/logoloom)** | Design di loghi con AI → SVG → esportazione del brand kit completo | `npx @mcpware/logoloom` |

## Autore

[ithiria894](https://github.com/ithiria894) - Sviluppa tool per l'ecosistema Claude Code.
