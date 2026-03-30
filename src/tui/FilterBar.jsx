import React from 'react';
import { Box, Text, useInput } from 'ink';
import { KEYS } from './keymaps.js';

const CATEGORIES = ['memory', 'skill', 'mcp', 'command', 'hook', 'plugin', 'agent', 'rule', 'plan', 'session', 'config'];

export function FilterBar({ filters, dispatch, isActive, filterCursor }) {
  useInput((input, key) => {
    if (!isActive) return;

    if (input === KEYS.left || key.leftArrow) {
      dispatch({ type: 'SET_FILTER_CURSOR', payload: Math.max(0, filterCursor - 1) });
      return;
    }
    if (input === KEYS.right || key.rightArrow) {
      dispatch({ type: 'SET_FILTER_CURSOR', payload: Math.min(CATEGORIES.length - 1, filterCursor + 1) });
      return;
    }
    if (key.return) {
      dispatch({ type: 'SET_FILTER', payload: CATEGORIES[filterCursor] });
      return;
    }
    if (input === KEYS.down || key.downArrow) {
      dispatch({ type: 'SET_FILTER_FOCUSED', payload: false });
      return;
    }
  });

  return (
    <Box flexWrap="wrap" gap={1}>
      {CATEGORIES.map((cat, i) => {
        const active = filters.includes(cat);
        const isCursor = isActive && i === filterCursor;
        return (
          <Text
            key={cat}
            inverse={isCursor}
            bold={active}
            color={active ? 'cyan' : '#d4d4d4'}
          >
            [{cat}]
          </Text>
        );
      })}
    </Box>
  );
}
