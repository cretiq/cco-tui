import { describe, it, expect } from 'vitest';
import { getVisibleItems, getItemsByCategory, getScopeTree, getSelectedItem } from '../selectors.js';

const scopes = [
  { id: 's1', name: 'Global', type: 'global', parentId: null },
  { id: 's2', name: 'my-project', type: 'project', parentId: null },
];

const items = [
  { path: '/a', name: 'a.md', category: 'memory', scopeId: 's1', size: '1 KB', sizeBytes: 1024 },
  { path: '/b', name: 'b.md', category: 'skill', scopeId: 's1', size: '2 KB', sizeBytes: 2048 },
  { path: '/c', name: 'c.md', category: 'memory', scopeId: 's2', size: '0.5 KB', sizeBytes: 512 },
  { path: '/d', name: 'z-plugin.md', category: 'plugin', scopeId: 's1', size: '3 KB', sizeBytes: 3072 },
];

describe('getVisibleItems', () => {
  it('returns all items when no scope or filter selected', () => {
    const state = { selectedScopeId: null, filters: [], search: '', items };
    expect(getVisibleItems(state)).toHaveLength(4);
  });

  it('filters by scope', () => {
    const state = { selectedScopeId: 's1', filters: [], search: '', items };
    expect(getVisibleItems(state)).toHaveLength(3);
  });

  it('filters by category', () => {
    const state = { selectedScopeId: null, filters: ['memory'], search: '', items };
    expect(getVisibleItems(state)).toHaveLength(2);
  });

  it('filters by search text (case-insensitive)', () => {
    const state = { selectedScopeId: null, filters: [], search: 'plugin', items };
    expect(getVisibleItems(state)).toHaveLength(1);
    expect(getVisibleItems(state)[0].name).toBe('z-plugin.md');
  });

  it('combines scope + filter + search', () => {
    const state = { selectedScopeId: 's1', filters: ['memory'], search: 'a', items };
    const result = getVisibleItems(state);
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/a');
  });
});

describe('getItemsByCategory', () => {
  it('groups items by category', () => {
    const grouped = getItemsByCategory(items);
    expect(grouped.memory).toHaveLength(2);
    expect(grouped.skill).toHaveLength(1);
    expect(grouped.plugin).toHaveLength(1);
  });
});

describe('getScopeTree', () => {
  it('returns scopes with item counts per category', () => {
    const tree = getScopeTree(scopes, items);
    expect(tree[0].id).toBe('s1');
    expect(tree[0].categoryCounts.memory).toBe(1);
    expect(tree[0].categoryCounts.skill).toBe(1);
    expect(tree[1].categoryCounts.memory).toBe(1);
  });
});

describe('getSelectedItem', () => {
  it('returns the item matching selectedItemPath', () => {
    const state = { selectedItemPath: '/b', items };
    expect(getSelectedItem(state).name).toBe('b.md');
  });

  it('returns null when no selection', () => {
    const state = { selectedItemPath: null, items };
    expect(getSelectedItem(state)).toBeNull();
  });
});
