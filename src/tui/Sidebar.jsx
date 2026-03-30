import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { getScopeTree } from './selectors.js';
import { useListNavigation } from './hooks/useListNavigation.js';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { KEYS } from './keymaps.js';
import { CATEGORY_COLORS, CATEGORY_ICONS } from './categoryMeta.js';

const SCOPE_GROUPS = [
  { id: 'phoenix', name: 'Phoenix', match: /^(p[1-5]|m5)$/ },
  { id: 'claude', name: 'Claude', match: /^(\.claude|\.claude_phoenix|claude-scratch|claude-code-organizer|cco-tui)$/ },
];

function groupChildScopes(children) {
  const groups = [];
  for (const g of SCOPE_GROUPS) {
    const members = children.filter(s => g.match.test(s.name));
    if (members.length > 0) groups.push({ ...g, members });
  }
  const ungrouped = children.filter(s => !SCOPE_GROUPS.some(g => g.match.test(s.name)));
  if (ungrouped.length > 0) {
    groups.push({ id: '_other', name: 'Projects', members: ungrouped });
  }
  return groups;
}

function toggleIn(setter, id) {
  setter(s => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
}

function buildFlatList(visibleTree, collapsed, collapsedGroups) {
  const list = [];
  const global = visibleTree.filter(s => s.type === 'global');
  const projects = visibleTree.filter(s => s.type !== 'global');

  for (const scope of global) {
    pushScope(list, scope, collapsed, 0);
  }

  if (projects.length > 0) {
    const groups = groupChildScopes(projects);
    for (const group of groups) {
      list.push({ type: 'group', group });
      if (collapsedGroups.has(group.id)) continue;
      for (const scope of group.members) {
        pushScope(list, scope, collapsed, 1);
      }
    }
  }

  return list;
}

function pushScope(list, scope, collapsed, indent) {
  list.push({ type: 'scope', scope, indent });
  if (collapsed.has(scope.id)) return;
  const cats = Object.entries(scope.categoryCounts).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of cats) {
    list.push({ type: 'category', scope, category: cat, count, indent });
  }
}

export function Sidebar({ state, dispatch }) {
  const isActive = state.focus === 'sidebar';
  const tree = useMemo(
    () => getScopeTree(state.scopes, state.items),
    [state.scopes, state.items],
  );
  const initialized = useRef(false);
  const [collapsed, setCollapsed] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [globalOnly, setGlobalOnly] = useState(false);

  useEffect(() => {
    if (tree.length > 0 && !initialized.current) {
      setCollapsed(new Set(tree.map(s => s.id)));
      initialized.current = true;
    }
  }, [tree.length]);

  const visibleTree = useMemo(
    () => globalOnly ? tree.filter(s => s.type === 'global') : tree,
    [tree, globalOnly],
  );

  const flatList = useMemo(
    () => buildFlatList(visibleTree, collapsed, collapsedGroups),
    [visibleTree, collapsed, collapsedGroups],
  );

  const { cursor, setCursor, handleInput, currentItem } = useListNavigation(flatList, {
    isActive,
    onSelect: (item) => {
      if (item.type === 'group') {
        toggleIn(setCollapsedGroups, item.group.id);
      } else if (item.type === 'scope') {
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

    if (input === 'g') {
      setGlobalOnly(v => !v);
      return;
    }

    if (input === KEYS.right) {
      if (currentItem?.type === 'group' && collapsedGroups.has(currentItem.group.id)) {
        toggleIn(setCollapsedGroups, currentItem.group.id);
      } else if (currentItem?.type === 'scope' && collapsed.has(currentItem.scope.id)) {
        toggleIn(setCollapsed, currentItem.scope.id);
      }
      return;
    }
    if (input === KEYS.left && currentItem) {
      if (currentItem.type === 'category') {
        // Jump to parent scope
        const scopeIdx = flatList.findIndex(f => f.type === 'scope' && f.scope.id === currentItem.scope.id);
        if (scopeIdx >= 0) setCursor(scopeIdx);
      } else if (currentItem.type === 'scope' && !collapsed.has(currentItem.scope.id)) {
        // Expanded scope: collapse it
        toggleIn(setCollapsed, currentItem.scope.id);
      } else if (currentItem.type === 'scope' && currentItem.indent) {
        // Collapsed child scope: jump to parent group
        const groupIdx = flatList.findLastIndex((f, fi) => f.type === 'group' && fi < cursor);
        if (groupIdx >= 0) setCursor(groupIdx);
      } else if (currentItem.type === 'group' && !collapsedGroups.has(currentItem.group.id)) {
        // Expanded group: collapse it
        toggleIn(setCollapsedGroups, currentItem.group.id);
      }
      return;
    }
  });

  const { rows } = useTerminalSize();
  const viewHeight = rows - 5;
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (flatList.length <= viewHeight) { setScrollOffset(0); return; }
    setScrollOffset(prev => {
      const pad = 2;
      let next = prev;
      if (cursor >= next + viewHeight - pad) next = cursor - viewHeight + pad + 1;
      if (cursor < next + pad) next = Math.max(0, cursor - pad);
      return Math.max(0, Math.min(next, flatList.length - viewHeight));
    });
  }, [cursor, flatList.length, viewHeight]);

  const visibleSlice = flatList.length <= viewHeight
    ? flatList.map((item, i) => ({ item, globalIdx: i }))
    : flatList.slice(scrollOffset, scrollOffset + viewHeight).map((item, i) => ({ item, globalIdx: scrollOffset + i }));

  return (
    <Box flexDirection="column" flexGrow={1}>
      {globalOnly && (
        <Box>
          <Text color="#fbbf24" bold>GLOBAL ONLY </Text>
          <Text color="#d4d4d4">(g: show all)</Text>
        </Box>
      )}
      {visibleSlice.map(({ item, globalIdx: i }) => {
        const selected = i === cursor && isActive;
        const ml = item.indent || 0;
        if (item.type === 'group') {
          const isExpanded = !collapsedGroups.has(item.group.id);
          const arrow = isExpanded ? '\uEB6E' : '\uEB70';
          const total = item.group.members.reduce((s, m) => s + (m.totalItems || 0), 0);
          return (
            <Box key={`grp-${item.group.id}`} marginLeft={ml}>
              <Text inverse={selected} bold color={selected ? undefined : '#fbbf24'}>
                {arrow} {item.group.name}
              </Text>
              {!isExpanded && <Text color="#d4d4d4"> ({total})</Text>}
            </Box>
          );
        }
        if (item.type === 'scope') {
          const isSelectedScope = state.selectedScopeId === item.scope.id;
          const isExpanded = !collapsed.has(item.scope.id);
          const arrow = isExpanded ? '\uEB6E' : '\uEB70';
          const total = item.scope.totalItems || 0;
          return (
            <Box key={`scope-${item.scope.id}`} marginLeft={ml}>
              <Text
                inverse={selected}
                bold={isSelectedScope}
                color={selected ? undefined : (isSelectedScope ? '#e5e5e5' : '#d4d4d4')}
              >
                {arrow} {item.scope.name}
              </Text>
              {!isExpanded && <Text color="#d4d4d4"> ({total})</Text>}
            </Box>
          );
        }
        const isFiltered = state.filters.includes(item.category);
        return (
          <Box key={`${item.scope.id}-${item.category}`} marginLeft={ml}>
            <Text
              inverse={selected}
              bold={isFiltered}
              color={CATEGORY_COLORS[item.category] || '#d4d4d4'}
            >
              {isFiltered ? ' \u25B8' : '  '}{CATEGORY_ICONS[item.category] || '\u25CF'} {item.category} ({item.count})
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
