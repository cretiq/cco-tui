import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useListNavigation } from './hooks/useListNavigation.js';

export function BudgetView({ state, dispatch }) {
  const isActive = state.focus === 'main' && state.view === 'budget';
  const [budgetData, setBudgetData] = useState(null);
  const [windowSize, setWindowSize] = useState(200000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { countTokens } = await import('../tokenizer.mjs');
      const { readFile } = await import('node:fs/promises');
      const results = [];
      for (const item of state.items) {
        try {
          const content = await readFile(item.path, 'utf8');
          const { tokens } = await countTokens(content);
          results.push({ ...item, tokens });
        } catch {
          results.push({ ...item, tokens: 0 });
        }
      }
      results.sort((a, b) => b.tokens - a.tokens);
      setBudgetData(results);
      setLoading(false);
    })();
  }, [state.items.length]);

  const items = budgetData || [];
  const totalTokens = items.reduce((sum, i) => sum + i.tokens, 0);
  const usableWindow = Math.floor(windowSize * 0.72);
  const maxBar = 30;

  const { cursor, handleInput } = useListNavigation(items, { isActive });

  useInput((input, key) => {
    if (!isActive) return;
    if (handleInput(input, key)) return;
    if (input === '1') setWindowSize(200000);
    if (input === '2') setWindowSize(1000000);
  });

  if (loading) {
    return <Box paddingX={1}><Text dimColor>Calculating token budget...</Text></Box>;
  }

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      <Box gap={2}>
        <Text dimColor>Window: </Text>
        <Text inverse={windowSize === 200000} bold={windowSize === 200000}>200K</Text>
        <Text inverse={windowSize === 1000000} bold={windowSize === 1000000}>1M</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {items.slice(0, 20).map((item, i) => {
          const pct = totalTokens > 0 ? item.tokens / totalTokens : 0;
          const barLen = Math.round(pct * maxBar);
          const bar = '█'.repeat(barLen) + '░'.repeat(maxBar - barLen);
          const selected = i === cursor && isActive;

          return (
            <Box key={item.path}>
              <Text inverse={selected}>
                {item.name.padEnd(24).slice(0, 24)}
              </Text>
              <Text color="yellow">{bar}</Text>
              <Text dimColor> {String(item.tokens).padStart(7)}</Text>
            </Box>
          );
        })}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text>Total: <Text bold color="yellow">{totalTokens.toLocaleString()}</Text> tokens</Text>
        <Text>Window: <Text dimColor>{usableWindow.toLocaleString()}</Text> usable (~72%)</Text>
        <Text>Usage: <Text bold color={totalTokens > usableWindow ? 'red' : 'green'}>
          {((totalTokens / usableWindow) * 100).toFixed(1)}%
        </Text></Text>
      </Box>
    </Box>
  );
}
