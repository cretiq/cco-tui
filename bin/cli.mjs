#!/usr/bin/env node

import { resolve } from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const subcommand = args.find(a => !a.startsWith('-'));
const scanDirFlag = args.indexOf('--scan-dir');
const scanDir = scanDirFlag !== -1 ? resolve(args[scanDirFlag + 1]) : undefined;

// MCP server mode (kept from upstream)
if (args.includes('--mcp')) {
  await import('../src/mcp-server.mjs');
  process.exit(0);
}

// JSON output modes
if (jsonMode && subcommand) {
  const { scan } = await import('../src/scanner.mjs');
  const data = await scan();

  if (subcommand === 'scan') {
    console.log(JSON.stringify(data, null, 2));
  } else if (subcommand === 'budget') {
    const { countTokens } = await import('../src/tokenizer.mjs');
    const { readFile } = await import('node:fs/promises');
    const budget = [];
    for (const item of data.items) {
      try {
        const content = await readFile(item.path, 'utf8');
        const { tokens } = await countTokens(content);
        budget.push({ ...item, tokens });
      } catch { budget.push({ ...item, tokens: 0 }); }
    }
    console.log(JSON.stringify(budget, null, 2));
  } else if (subcommand === 'audit') {
    const { introspectServers } = await import('../src/mcp-introspector.mjs');
    const { runSecurityScan } = await import('../src/security-scanner.mjs');
    const mcpItems = data.items.filter(i => i.category === 'mcp');
    const introspection = await introspectServers(mcpItems);
    const report = await runSecurityScan(introspection, data);
    console.log(JSON.stringify(report, null, 2));
  }
  process.exit(0);
}

// TUI mode (default)
const { render } = await import('ink');
const React = await import('react');
const { default: App } = await import('../src/tui/App.jsx');

render(React.createElement(App, { scanDir }));
