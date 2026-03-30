import React from 'react';
import { Box, Text } from 'ink';
import { KEYS, keymapMode } from './keymaps.js';

const navKeys = `${KEYS.up}/${KEYS.down}`;
const SHORTCUTS = {
  items: [
    { key: navKeys, action: 'navigate' },
    { key: 'm', action: 'move' },
    { key: 'd', action: 'delete' },
    { key: '/', action: 'search' },
    { key: 'v', action: 'bulk' },
    { key: 'b', action: 'budget' },
    { key: 's', action: 'security' },
    { key: 'Tab', action: 'panel' },
    { key: '?', action: 'help' },
    { key: 'q', action: 'quit' },
  ],
  budget: [
    { key: '↑↓', action: 'select' },
    { key: '1/2', action: 'window' },
    { key: 'Esc', action: 'back' },
    { key: 'q', action: 'quit' },
  ],
  security: [
    { key: '↑↓', action: 'select' },
    { key: 'f', action: 'filter' },
    { key: 'd', action: 'delete' },
    { key: 'Esc', action: 'back' },
    { key: 'q', action: 'quit' },
  ],
};

export function BottomBar({ view }) {
  const shortcuts = SHORTCUTS[view] || SHORTCUTS.items;

  return (
    <Box height={1} width="100%">
      {shortcuts.map((s, i) => (
        <React.Fragment key={s.key}>
          {i > 0 && <Text color="#d4d4d4">  </Text>}
          <Text bold color="cyan">{s.key}</Text>
          <Text color="#d4d4d4">: {s.action}</Text>
        </React.Fragment>
      ))}
    </Box>
  );
}
