# Claude Code Organizer

[![npm version](https://img.shields.io/npm/v/@mcpware/claude-code-organizer)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![npm downloads](https://img.shields.io/npm/dt/@mcpware/claude-code-organizer?label=downloads)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![GitHub stars](https://img.shields.io/github/stars/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Bahasa Indonesia](README.id.md) | [Italiano](README.it.md) | Português | [Türkçe](README.tr.md) | [Tiếng Việt](README.vi.md) | [ไทย](README.th.md)

**Organize todas as memories, skills, servidores MCP e hooks do Claude Code — veja tudo pela hierarquia de scopes e mova itens entre scopes com drag-and-drop.**

![Claude Code Organizer Demo](docs/demo.gif)

## o problema

O Claude Code cria memories, skills e configs de MCP em silêncio toda vez que você trabalha — e joga tudo no scope que corresponde ao diretório atual. Uma preferência que você queria em todo lugar? Ficou presa em um único projeto. Uma skill de deploy que só faz sentido para um repo específico? Vazou para `Global` e passou a contaminar todos os outros projetos.

**Isso não é só bagunça — isso piora a performance da sua IA.** Em cada sessão, o Claude carrega para a janela de contexto todas as configs do scope atual mais tudo o que é herdado dos scopes pai. Itens no scope errado = tokens desperdiçados, contexto poluído e menos precisão. Uma skill de pipeline em Python parada no `Global` vai ser carregada na sua sessão de frontend React. Entradas MCP duplicadas inicializam o mesmo servidor duas vezes. Memories antigas passam a contradizer as instruções atuais.

### "é só pedir para o Claude arrumar"

Você até pode pedir ao Claude Code que gerencie a própria config. Mas vai ser um vai e volta: `ls` em um diretório, `cat` em cada arquivo, e a tentativa de montar o quadro completo a partir de fragmentos de texto. **Não existe um comando que mostre a árvore inteira** com todos os scopes, todos os itens e toda a herança de uma vez.

### a solução: um dashboard visual

```bash
npx @mcpware/claude-code-organizer
```

Um comando. Você vê tudo o que o Claude guardou, organizado pela hierarquia de scopes. **Arraste itens entre scopes.** Apague memories antigas. Encontre duplicatas. Retome o controle sobre o que realmente influencia o comportamento do Claude.

### exemplo: `Project` → `Global`

Você disse ao Claude "I prefer TypeScript + ESM" enquanto estava dentro de um projeto, mas essa preferência vale em todo lugar. Abra o dashboard, arraste essa memory de `Project` para `Global`. **Pronto. Um arraste só.**

### exemplo: `Global` → `Project`

Uma skill de deploy no `Global` só faz sentido para um repo. Arraste para aquele scope `Project` — os outros projetos deixam de vê-la.

### exemplo: apagar memories antigas

O Claude cria memories automaticamente a partir de coisas que você comentou por acaso, ou do que ele *achou* que deveria lembrar. Uma semana depois, elas já não servem mais, mas continuam sendo carregadas em toda sessão. Navegue, leia, apague. **Você decide o que o Claude acha que sabe sobre você.**

---

## funcionalidades

- **Hierarquia por scope** — Veja todos os itens organizados como `Global` > `Workspace` > `Project`, com indicadores de herança
- **Drag-and-drop** — Mova memories entre scopes, skills entre `Global` e scopes por repo, servidores MCP entre configs
- **Confirmação de move** — Todo move abre um modal de confirmação antes de tocar em qualquer arquivo
- **Segurança por tipo** — Memories só podem ir para pastas de memory, skills para pastas de skill, MCP para configs de MCP
- **Busca e filtro** — Pesquise instantaneamente em todos os itens e filtre por categoria (`Memory`, `Skills`, `MCP`, `Config`, `Hooks`, `Plugins`, `Plans`)
- **Painel de detalhes** — Clique em qualquer item para ver metadados completos, descrição, caminho do arquivo e abrir no VS Code
- **Scan completo por projeto** — Cada scope mostra todos os tipos de item: memories, `Skills`, servidores MCP, `Config`, `Hooks` e `Plans`
- **Move real de arquivos** — Move de verdade arquivos em `~/.claude/`; não é só um viewer
- **45 testes E2E** — Suite de testes Playwright com verificação real de filesystem depois de cada operação

## por que um dashboard visual?

O Claude Code já consegue listar e mover arquivos via CLI — mas, na prática, você fica num jogo de adivinhação com a própria config. O dashboard te dá **visibilidade total de relance:**

| O que você precisa | Pedir ao Claude | dashboard visual |
|---------------|:-----------:|:----------------:|
| **Ver tudo de uma vez** em todos os scopes | `ls` em um diretório por vez, montando o resto na mão | Árvore de scopes, de relance |
| **O que está carregado no meu projeto atual?** | Rodar vários comandos e torcer para não esquecer nada | Abrir o projeto → ver a cadeia completa de herança |
| **Mover itens entre scopes** | Encontrar paths codificados e usar `mv` na mão | Drag-and-drop com confirmação |
| **Ler o conteúdo da config** | `cat` em cada arquivo, um por um | Clique → painel lateral |
| **Encontrar duplicatas / itens antigos** | `grep` em diretórios crípticos | Busca + filtro por categoria |
| **Limpar memories sem uso** | Descobrir sozinho quais arquivos apagar | Navegar, ler e apagar no lugar |

## início rápido

### opção 1: npx (sem instalar)

```bash
npx @mcpware/claude-code-organizer
```

### opção 2: instalação global

```bash
npm install -g @mcpware/claude-code-organizer
claude-code-organizer
```

### opção 3: pedir ao Claude

Cole isto no Claude Code:

> Rode `npx @mcpware/claude-code-organizer` — é um dashboard para gerenciar a config do Claude Code. Me diga a URL quando estiver pronto.

Abre um dashboard em `http://localhost:3847`. Funciona com o seu diretório real em `~/.claude/`.

## o que ele gerencia

| Tipo | Ver | Mover | Faz scan em | Por que fica bloqueado? |
|------|:----:|:----:|:----------:|-------------|
| `Memory` (feedback, user, project, reference) | Sim | Sim | `Global` + `Project` | — |
| `Skills` | Sim | Sim | `Global` + `Project` | — |
| MCP Servers | Sim | Sim | `Global` + `Project` | — |
| `Config` (CLAUDE.md, settings.json) | Sim | Bloqueado | `Global` + `Project` | Config de sistema — mover pode quebrar a config |
| `Hooks` | Sim | Bloqueado | `Global` + `Project` | Dependem do contexto das settings — mover pode causar falhas silenciosas |
| `Plans` | Sim | Sim | `Global` + `Project` | — |
| `Plugins` | Sim | Bloqueado | Só `Global` | Cache gerenciado pelo Claude Code |

## hierarquia de scopes

```
Global                       <- applies everywhere
  Company (workspace)        <- applies to all sub-projects
    CompanyRepo1             <- project-specific
    CompanyRepo2             <- project-specific
  SideProjects (project)     <- independent project
  Documents (project)        <- independent project
```

Scopes filhos herdam memories, skills e servidores MCP dos scopes pai.

## como funciona

1. **Faz scan em** `~/.claude/` — descobre todos os projetos, memories, skills, servidores MCP, hooks, plugins e plans
2. **Determina a hierarquia de scopes** — identifica as relações de pai e filho a partir dos paths no filesystem
3. **Renderiza o dashboard** — cabeçalhos de scope > barras de categoria > linhas de item, com a indentação correta
4. **Executa os moves** — quando você arrasta ou clica em "Move to...", os arquivos são realmente movidos no disco com safety checks

## comparação

Analisamos todas as ferramentas de config do Claude Code que conseguimos encontrar. Nenhuma oferecia hierarquia visual de scopes + moves entre scopes com drag-and-drop em um dashboard standalone.

| O que eu precisava | Desktop app (600+⭐) | VS Code extension | Full-stack web app | **Claude Code Organizer** |
|---------|:---:|:---:|:---:|:---:|
| Árvore de scopes | No | Yes | Partial | **Yes** |
| Moves com drag-and-drop | No | No | No | **Yes** |
| Moves entre scopes | No | One-click | No | **Yes** |
| Apagar itens antigos | No | No | No | **Yes** |
| Ferramentas MCP | No | No | Yes | **Yes** |
| Zero dependências | No (Tauri) | No (VS Code) | No (React+Rust+SQLite) | **Yes** |
| Standalone (sem IDE) | Yes | No | Yes | **Yes** |

## suporte de plataforma

| Platform | Status |
|----------|:------:|
| Ubuntu / Linux | Supported |
| macOS (Intel + Apple Silicon) | Supported (community-tested on Sequoia M3) |
| Windows | Not yet |
| WSL | Should work (untested) |

## estrutura do projeto

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

Frontend e backend são totalmente separados. Edite os arquivos em `src/ui/` para mudar o visual sem tocar na lógica.

## API

O dashboard é sustentado por uma REST API:

| Endpoint | Método | Descrição |
|----------|--------|-------------|
| `/api/scan` | GET | Faz scan de todas as customizações e retorna scopes + items + contagens |
| `/api/move` | POST | Move um item para outro scope (com suporte a desambiguação por categoria/nome) |
| `/api/delete` | POST | Apaga um item permanentemente |
| `/api/restore` | POST | Restaura um arquivo apagado (para desfazer) |
| `/api/restore-mcp` | POST | Restaura uma entrada apagada de servidor MCP |
| `/api/destinations` | GET | Retorna os destinos válidos de move para um item |
| `/api/file-content` | GET | Lê o conteúdo do arquivo para o painel de detalhes |

## licença

MIT

## mais de @mcpware

| Project | O que faz | Install |
|---------|---|---|
| **[Instagram MCP](https://github.com/mcpware/instagram-mcp)** | 23 ferramentas da Instagram Graph API — posts, comentários, DMs, stories e analytics | `npx @mcpware/instagram-mcp` |
| **[UI Annotator](https://github.com/mcpware/ui-annotator-mcp)** | Labels de hover em qualquer página web — a IA referencia elementos pelo nome | `npx @mcpware/ui-annotator` |
| **[Pagecast](https://github.com/mcpware/pagecast)** | Grava sessões do navegador como GIF ou vídeo via MCP | `npx @mcpware/pagecast` |
| **[LogoLoom](https://github.com/mcpware/logoloom)** | Design de logo com IA → SVG → exportação completa de brand kit | `npx @mcpware/logoloom` |

## autor

[ithiria894](https://github.com/ithiria894) — Criando ferramentas para o ecossistema do Claude Code.
