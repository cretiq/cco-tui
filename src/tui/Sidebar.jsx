import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { getScopeTree } from './selectors.js';
import { useListNavigation } from './hooks/useListNavigation.js';
import { KEYS } from './keymaps.js';

const CATEGORY_COLORS = {
  memory: '#c4b5fd',
  skill: '#fb923c',
  mcp: '#34d399',
  command: '#60a5fa',
  hook: '#f472b6',
  plugin: '#fbbf24',
  agent: '#22d3ee',
  rule: '#d4d4d4',
  plan: '#d4d4d4',
  session: '#d4d4d4',
  config: '#d4d4d4',
};

const CATEGORY_ICONS = {
  memory: '',    // nf-cod-lightbulb
  skill: '',    // nf-cod-wand
  mcp: '',     // nf-cod-server
  command: '',   // nf-cod-terminal
  hook: '',    // nf-cod-symbol_event
  plugin: '',   // nf-cod-extensions
  agent: '',    // nf-cod-hubot
  rule: '',    // nf-cod-shield
  plan: '',    // nf-cod-list_ordered
  session: '',   // nf-cod-history
  config: '',   // nf-cod-gear
};

export function Sidebar({ state, dispatch }) {
  const isActive = state.focus === 'sidebar';
  const tree = getScopeTree(state.scopes, state.items);
  const initialized = useRef(false);
  const [collapsed, setCollapsed] = useState(new Set());
  const [globalOnly, setGlobalOnly] = useState(false);

  // Start with all scopes collapsed
  useEffect(() => {
    if (tree.length > 0 && !initialized.current) {
      setCollapsed(new Set(tree.map(s => s.id)));
      initialized.current = true;
    }
  }, [tree.length]);

  const toggleCollapse = (scopeId) => {
    setCollapsed(c => {
      const n = new Set(c);
      if (n.has(scopeId)) n.delete(scopeId);
      else n.add(scopeId);
      return n;
    });
  };

  const visibleTree = globalOnly ? tree.filter(s => s.type === 'global') : tree;
  const flatList = [];
  for (const scope of visibleTree) {
    flatList.push({ type: 'scope', scope });
    if (!collapsed.has(scope.id)) {
      const cats = Object.entries(scope.categoryCounts).sort((a, b) => b[1] - a[1]);
      for (const [cat, count] of cats) {
        flatList.push({ type: 'category', scope, category: cat, count });
      }
    }
  }

  const { cursor, setCursor, handleInput, currentItem } = useListNavigation(flatList, {
    isActive,
    onSelect: (item) => {
      // Enter = select scope/category to filter items in main panel
      if (item.type === 'scope') {
        dispatch({ type: 'SET_SCOPE', payload: item.scope.id });
      } else {
        dispatch({ type: 'SET_SCOPE', payload: item.scope.id });
        dispatch({ type: 'SET_FILTER', payload: item.category });
      }
    },
  });

  useInput((input, key) => {
    if (!isActive) return;
    if (handleInput(input, key)) return;

    // g = toggle: show only Global scopes / show all
    if (input === 'g') {
      setGlobalOnly(v => !v);
      return;
    }

    // KEYS.right = expand, KEYS.left = collapse (vim tree-style)
    if (input === KEYS.right && currentItem?.type === 'scope') {
      if (collapsed.has(currentItem.scope.id)) {
        toggleCollapse(currentItem.scope.id);
      }
      return;
    }
    if (input === KEYS.left && currentItem) {
      if (currentItem.type === 'category') {
        // left on category: collapse parent and jump to it
        const scopeId = currentItem.scope.id;
        if (!collapsed.has(scopeId)) toggleCollapse(scopeId);
        const scopeIdx = flatList.findIndex(f => f.type === 'scope' && f.scope.id === scopeId);
        if (scopeIdx >= 0) setCursor(scopeIdx);
      } else if (!collapsed.has(currentItem.scope.id)) {
        toggleCollapse(currentItem.scope.id);
      }
      return;
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      {globalOnly && (
        <Box>
          <Text color="#fbbf24" bold>GLOBAL ONLY </Text>
          <Text color="#d4d4d4">(g: show all)</Text>
        </Box>
      )}
      {flatList.map((item, i) => {
        const selected = i === cursor && isActive;
        const isSelectedScope = state.selectedScopeId === item.scope?.id;
        if (item.type === 'scope') {
          const isExpanded = !collapsed.has(item.scope.id);
          const arrow = isExpanded ? '▼' : '▶';
          const total = item.scope.totalItems || 0;
          return (
            <Box key={item.scope.id}>
              <Text
                inverse={selected}
                bold={isSelectedScope}
                color={selected ? undefined : (isSelectedScope ? '#e5e5e5' : '#d4d4d4')}
              >
                {arrow} {item.scope.name}
              </Text>
              {!isExpanded && (
                <Text color="#d4d4d4"> ({total})</Text>
              )}
            </Box>
          );
        }
        return (
          <Box key={`${item.scope.id}-${item.category}`}>
            <Text
              inverse={selected}
              color={CATEGORY_COLORS[item.category] || '#d4d4d4'}
            >
              {'  '}{CATEGORY_ICONS[item.category] || '●'} {item.category} ({item.count})
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
