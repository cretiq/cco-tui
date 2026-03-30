import { build } from 'esbuild';
import { globSync } from 'node:fs';

await build({
  entryPoints: globSync('src/tui/**/*.jsx'),
  outdir: 'lib/tui',
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  bundle: false,
  sourcemap: true,
});
