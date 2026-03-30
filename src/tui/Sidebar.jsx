import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getScopeTree } from './selectors.js';
import { useListNavigation } from './hooks/useListNavigation.js';

const CATEGORY_COLORS = {
  memory: 'magenta',
  skill: '#fb923c',
  mcp: 'green',
  command: 'blue',
  hook: '#f472b6',
  plugin: 'yellow',
  agent: 'cyan',
  rule: 'white',
  plan: 'white',
  session: 'white',
  config: 'white',
};

export function Sidebar({ state, dispatch }) {
  const isActive = state.focus === 'sidebar';
  const tree = getScopeTree(state.scopes, state.items);
  const [collapsed, setCollapsed] = useState(new Set());

  const flatList = [];
  for (const scope of tree) {
    flatList.push({ type: 'scope', scope });
    if (!collapsed.has(scope.id)) {
      for (const [cat, count] of Object.entries(scope.categoryCounts)) {
        flatList.push({ type: 'category', scope, category: cat, count });
      }
    }
  }

  const { cursor, handleInput } = useListNavigation(flatList, {
    isActive,
    onSelect: (item) => {
      if (item.type === 'scope') {
        if (collapsed.has(item.scope.id)) {
          setCollapsed(c => { const n = new Set(c); n.delete(item.scope.id); return n; });
        } else {
          setCollapsed(c => new Set(c).add(item.scope.id));
        }
        dispatch({ type: 'SET_SCOPE', payload: item.scope.id });
      } else {
        dispatch({ type: 'SET_SCOPE', payload: item.scope.id });
        dispatch({ type: 'SET_FILTER', payload: item.category });
      }
    },
  });

  useInput((input, key) => {
    if (isActive) handleInput(input, key);
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      {flatList.map((item, i) => {
        const selected = i === cursor && isActive;
        if (item.type === 'scope') {
          const arrow = collapsed.has(item.scope.id) ? '▶' : '▼';
          return (
            <Box key={item.scope.id}>
              <Text
                inverse={selected}
                bold={state.selectedScopeId === item.scope.id}
              >
                {' '}{arrow} {item.scope.name}
              </Text>
            </Box>
          );
        }
        return (
          <Box key={`${item.scope.id}-${item.category}`} marginLeft={2}>
            <Text
              inverse={selected}
              color={CATEGORY_COLORS[item.category] || 'white'}
            >
              ● {item.category} ({item.count})
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
