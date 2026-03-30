import React from 'react';
import { Box, Text } from 'ink';

const CATEGORIES = ['memory', 'skill', 'mcp', 'command', 'hook', 'plugin', 'agent', 'rule', 'plan', 'session', 'config'];

export function FilterBar({ filters, dispatch }) {
  return (
    <Box flexWrap="wrap" gap={1}>
      {CATEGORIES.map(cat => {
        const active = filters.includes(cat);
        return (
          <Text
            key={cat}
            inverse={active}
            color={active ? 'cyan' : '#d4d4d4'}
          >
            [{cat}]
          </Text>
        );
      })}
    </Box>
  );
}
