import React from 'react';
import { Box, Text, useInput } from 'ink';
import { getVisibleItems, getItemsByCategory } from './selectors.js';
import { useListNavigation } from './hooks/useListNavigation.js';

export function ItemList({ state, dispatch }) {
  const isActive = state.focus === 'main';
  const visible = getVisibleItems(state);
  const grouped = getItemsByCategory(visible);
  const categories = Object.keys(grouped).sort();

  const flatItems = [];
  for (const cat of categories) {
    for (const item of grouped[cat]) {
      flatItems.push(item);
    }
  }

  const { cursor, handleInput, currentItem } = useListNavigation(flatItems, {
    isActive,
    onSelect: (item) => {
      dispatch({ type: 'SELECT_ITEM', payload: item.path });
      if (item.category === 'session') {
        dispatch({ type: 'SET_VIEW', payload: 'session' });
      }
    },
  });

  useInput((input, key) => {
    if (!isActive || state.modal) return;

    if (handleInput(input, key)) return;

    if (input === 'm' && currentItem) {
      const paths = state.bulk
        ? [...state.bulkSelected]
        : [currentItem.path];
      dispatch({ type: 'SHOW_MODAL', payload: { type: 'move', paths } });
      return;
    }

    if (input === 'd' && currentItem) {
      const paths = state.bulk
        ? [...state.bulkSelected]
        : [currentItem.path];
      dispatch({ type: 'SHOW_MODAL', payload: { type: 'delete', paths } });
      return;
    }

    if (input === ' ' && state.bulk && currentItem) {
      dispatch({ type: 'BULK_TOGGLE_ITEM', payload: currentItem.path });
    }
  });

  if (flatItems.length === 0) {
    return (
      <Box paddingX={1}>
        <Text dimColor>{state.loading ? 'Scanning...' : 'No items found'}</Text>
      </Box>
    );
  }

  let itemIndex = 0;
  return (
    <Box flexDirection="column" flexGrow={1}>
      {categories.map(cat => (
        <Box key={cat} flexDirection="column">
          <Box marginTop={itemIndex > 0 ? 1 : 0}>
            <Text bold color="yellow">{cat.toUpperCase()}</Text>
          </Box>
          <Box>
            <Text dimColor>{'─'.repeat(40)}</Text>
          </Box>
          {grouped[cat].map(item => {
            const idx = itemIndex++;
            const selected = idx === cursor && isActive;
            const checked = state.bulkSelected.has(item.path);

            return (
              <Box key={item.path} flexDirection="column">
                <Box>
                  {state.bulk && (
                    <Text color={checked ? 'cyan' : 'gray'}>
                      {checked ? '[✓] ' : '[ ] '}
                    </Text>
                  )}
                  <Text inverse={selected} bold={selected} color={selected ? undefined : 'white'}>
                    {'▸ '}{item.name}
                  </Text>
                  <Box flexGrow={1} />
                  <Text color="#a3a3a3">
                    {item.size || ''}  {item.mtime ? item.mtime.slice(0, 10) : ''}
                  </Text>
                </Box>
                <Box marginLeft={state.bulk ? 6 : 2}>
                  <Text color="#c4b5fd">{item.category}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
