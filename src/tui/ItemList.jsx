import React, { useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { getVisibleItems, getItemsByCategory } from './selectors.js';
import { useListNavigation } from './hooks/useListNavigation.js';
import { CATEGORY_COLORS, CATEGORY_ICONS } from './categoryMeta.js';
import { KEYS } from './keymaps.js';
import { useTerminalSize } from './hooks/useTerminalSize.js';

const SIDEBAR_W = 38;
const DETAIL_W = 34;
const CHROME_ROWS = 6;
const SIZE_W = 6;
const DATE_W = 10;

function truncate(str, max) {
  if (max < 1) return '';
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '\u2026';
}

export function ItemList({ state, dispatch }) {
  const isActive = state.focus === 'main' && !state.filterFocused;
  const { columns, rows } = useTerminalSize();
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

    if ((key.upArrow || input === KEYS.up) && cursor === 0) {
      dispatch({ type: 'SET_FILTER_FOCUSED', payload: true });
      return;
    }

    if (handleInput(input, key)) return;

    if (input === 'm' && currentItem) {
      const paths = state.bulk ? [...state.bulkSelected] : [currentItem.path];
      dispatch({ type: 'SHOW_MODAL', payload: { type: 'move', paths } });
      return;
    }
    if (input === 'd' && currentItem) {
      const paths = state.bulk ? [...state.bulkSelected] : [currentItem.path];
      dispatch({ type: 'SHOW_MODAL', payload: { type: 'delete', paths } });
      return;
    }
    if (input === ' ' && state.bulk && currentItem) {
      dispatch({ type: 'BULK_TOGGLE_ITEM', payload: currentItem.path });
    }
  });

  // Layout
  const showSidebar = columns >= 60;
  const showDetail = columns >= 100;
  const contentWidth = columns - (showSidebar ? SIDEBAR_W : 0) - (showDetail ? DETAIL_W : 0) - 5;
  const viewportHeight = Math.max(5, rows - CHROME_ROWS);
  const bulkW = state.bulk ? 4 : 0;
  const nameMax = Math.max(10, contentWidth - 2 - bulkW - 2 - SIZE_W - 2 - DATE_W);

  // Build visual rows
  const visualRows = [];
  let itemIdx = 0;
  let cursorVisualRow = 0;

  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci];
    if (ci > 0) visualRows.push({ type: 'spacer', key: `sp-${cat}` });
    visualRows.push({ type: 'header', cat, count: grouped[cat].length, key: `hdr-${cat}` });
    visualRows.push({ type: 'separator', cat, key: `sep-${cat}` });
    for (const item of grouped[cat]) {
      if (itemIdx === cursor) cursorVisualRow = visualRows.length;
      visualRows.push({ type: 'item', item, idx: itemIdx, key: item.path });
      itemIdx++;
    }
  }

  // Scroll (ref avoids double-render flicker)
  const scrollRef = useRef(0);
  let scrollOffset = scrollRef.current;
  if (cursorVisualRow < scrollOffset) scrollOffset = cursorVisualRow;
  else if (cursorVisualRow >= scrollOffset + viewportHeight) scrollOffset = cursorVisualRow - viewportHeight + 1;
  scrollOffset = Math.min(scrollOffset, Math.max(0, visualRows.length - viewportHeight));
  scrollRef.current = scrollOffset;

  if (flatItems.length === 0) {
    return (
      <Box paddingX={1}>
        <Text color="#d4d4d4">{state.loading ? 'Scanning...' : 'No items found'}</Text>
      </Box>
    );
  }

  const visibleRows = visualRows.slice(scrollOffset, scrollOffset + viewportHeight);

  return (
    <Box flexDirection="column" height={viewportHeight}>
      {visibleRows.map(row => {
        if (row.type === 'spacer') {
          return <Box key={row.key} height={1} />;
        }
        if (row.type === 'header') {
          const color = CATEGORY_COLORS[row.cat] || '#d4d4d4';
          const icon = CATEGORY_ICONS[row.cat] || '\u25CF';
          return (
            <Box key={row.key}>
              <Text bold color={color}>{icon} {row.cat.toUpperCase()}</Text>
              <Text color="#737373"> ({row.count})</Text>
            </Box>
          );
        }
        if (row.type === 'separator') {
          const color = CATEGORY_COLORS[row.cat] || '#d4d4d4';
          return (
            <Box key={row.key}>
              <Text color={color}>{'─'.repeat(Math.min(44, contentWidth))}</Text>
            </Box>
          );
        }
        const { item, idx } = row;
        const selected = idx === cursor && isActive;
        const checked = state.bulkSelected.has(item.path);
        const name = truncate(item.name, nameMax).padEnd(nameMax);
        const size = (item.size || '').padStart(SIZE_W);
        const date = item.mtime ? item.mtime.slice(0, 10) : '';

        return (
          <Box key={row.key} paddingLeft={1}>
            {state.bulk && (
              <Text color={checked ? 'cyan' : 'gray'}>
                {checked ? '[\u2713] ' : '[ ] '}
              </Text>
            )}
            <Text inverse={selected} bold={selected} color={selected ? undefined : '#e5e5e5'}>
              {'\u25B8 '}{name}
            </Text>
            <Text color="#737373">
              {'  '}{size}  {date}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
