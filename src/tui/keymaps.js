import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const STATE_FILE = join(homedir(), '.dotfiles/vim/.vim/keymap_state');

function getKeymapMode() {
  try {
    return readFileSync(STATE_FILE, 'utf8').trim();
  } catch {
    return 'default';
  }
}

const mode = getKeymapMode();

// Default (HJKL): h=left, j=down, k=up, l=right
// Custom (JKLÖ): j=left, k=down, l=up, ö=right
export const KEYS = mode === 'custom'
  ? { left: 'j', down: 'k', up: 'l', right: 'ö' }
  : { left: 'h', down: 'j', up: 'k', right: 'l' };

export const keymapMode = mode;
