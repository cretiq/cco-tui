import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { KEYS } from './keymaps.js';

const ROLE_COLORS = { human: 'blue', assistant: 'green', system: 'yellow' };

export function SessionPreview({ sessionPath, dispatch }) {
  const [messages, setMessages] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [title, setTitle] = useState('');

  useEffect(() => {
    (async () => {
      const { readFile } = await import('node:fs/promises');
      const content = await readFile(sessionPath, 'utf8');
      const lines = content.trim().split('\n').filter(Boolean);
      const parsed = [];
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'human' || obj.type === 'assistant' || obj.role) {
            parsed.push({
              role: obj.type || obj.role,
              content: typeof obj.message === 'string'
                ? obj.message
                : obj.content || obj.text || JSON.stringify(obj).slice(0, 200),
            });
          }
        } catch { /* skip non-JSON lines */ }
      }
      setMessages(parsed);
      setTitle(sessionPath.split('/').pop());
    })();
  }, [sessionPath]);

  useInput((input, key) => {
    if (key.escape) {
      dispatch({ type: 'SET_VIEW', payload: 'items' });
      dispatch({ type: 'SELECT_ITEM', payload: null });
      return;
    }
    if (key.upArrow || input === KEYS.up) {
      setScrollOffset(o => Math.max(0, o - 1));
    }
    if (key.downArrow || input === KEYS.down) {
      setScrollOffset(o => Math.min(messages.length - 1, o + 1));
    }
    if (key.pageUp) {
      setScrollOffset(o => Math.max(0, o - 10));
    }
    if (key.pageDown) {
      setScrollOffset(o => Math.min(messages.length - 1, o + 10));
    }
  });

  const visible = messages.slice(scrollOffset, scrollOffset + 20);

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      <Text bold>{title}</Text>
      <Text dimColor>{messages.length} messages</Text>
      <Box marginTop={1} flexDirection="column" flexGrow={1}>
        {visible.map((msg, i) => {
          const color = ROLE_COLORS[msg.role] || 'white';
          return (
            <Box key={scrollOffset + i} flexDirection="column" marginBottom={1}>
              <Text bold color={color}>┃ {msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}</Text>
              {msg.content.split('\n').slice(0, 6).map((line, li) => (
                <Text key={li} color={color}>┃ <Text>{line}</Text></Text>
              ))}
            </Box>
          );
        })}
      </Box>
      <Text dimColor>↑↓: scroll  PgUp/PgDn: page  Esc: back</Text>
    </Box>
  );
}
