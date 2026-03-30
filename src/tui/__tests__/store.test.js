import { describe, it, expect } from 'vitest';
import { reducer, initialState } from '../store.js';

describe('reducer', () => {
  it('has correct initial state', () => {
    expect(initialState).toEqual({
      scopes: [],
      items: [],
      counts: {},
      selectedScopeId: null,
      selectedItemPath: null,
      view: 'items',
      filters: [],
      search: '',
      focus: 'sidebar',
      filterFocused: false,
      filterCursor: 0,
      bulk: false,
      bulkSelected: new Set(),
      modal: null,
      toast: null,
      loading: true,
      searching: false,
    });
  });

  it('handles SCAN_COMPLETE', () => {
    const payload = {
      scopes: [{ id: 's1', name: 'Global', type: 'global' }],
      items: [{ path: '/a', name: 'a', category: 'memory', scopeId: 's1' }],
      counts: { memory: 1, total: 1 },
    };
    const state = reducer(initialState, { type: 'SCAN_COMPLETE', payload });
    expect(state.scopes).toEqual(payload.scopes);
    expect(state.items).toEqual(payload.items);
    expect(state.counts).toEqual(payload.counts);
    expect(state.loading).toBe(false);
  });

  it('handles SET_SCOPE', () => {
    const state = reducer(initialState, { type: 'SET_SCOPE', payload: 's1' });
    expect(state.selectedScopeId).toBe('s1');
    expect(state.selectedItemPath).toBeNull();
  });

  it('handles SELECT_ITEM', () => {
    const state = reducer(initialState, { type: 'SELECT_ITEM', payload: '/a' });
    expect(state.selectedItemPath).toBe('/a');
  });

  it('handles SET_VIEW', () => {
    const state = reducer(initialState, { type: 'SET_VIEW', payload: 'budget' });
    expect(state.view).toBe('budget');
  });

  it('handles SET_FILTER — toggles category', () => {
    let state = reducer(initialState, { type: 'SET_FILTER', payload: 'memory' });
    expect(state.filters).toEqual(['memory']);
    state = reducer(state, { type: 'SET_FILTER', payload: 'skill' });
    expect(state.filters).toEqual(['memory', 'skill']);
    state = reducer(state, { type: 'SET_FILTER', payload: 'memory' });
    expect(state.filters).toEqual(['skill']);
  });

  it('handles SET_SEARCH', () => {
    const state = reducer(initialState, { type: 'SET_SEARCH', payload: 'foo' });
    expect(state.search).toBe('foo');
  });

  it('handles SET_FOCUS', () => {
    const state = reducer(initialState, { type: 'SET_FOCUS', payload: 'main' });
    expect(state.focus).toBe('main');
  });

  it('handles TOGGLE_BULK', () => {
    let state = reducer(initialState, { type: 'TOGGLE_BULK' });
    expect(state.bulk).toBe(true);
    expect(state.bulkSelected).toEqual(new Set());
    state = reducer(state, { type: 'TOGGLE_BULK' });
    expect(state.bulk).toBe(false);
    expect(state.bulkSelected).toEqual(new Set());
  });

  it('handles BULK_TOGGLE_ITEM', () => {
    let state = reducer({ ...initialState, bulk: true }, {
      type: 'BULK_TOGGLE_ITEM', payload: '/a',
    });
    expect(state.bulkSelected).toEqual(new Set(['/a']));
    state = reducer(state, { type: 'BULK_TOGGLE_ITEM', payload: '/a' });
    expect(state.bulkSelected).toEqual(new Set());
  });

  it('handles SHOW_MODAL and HIDE_MODAL', () => {
    const state = reducer(initialState, {
      type: 'SHOW_MODAL', payload: { type: 'move', itemPath: '/a' },
    });
    expect(state.modal).toEqual({ type: 'move', itemPath: '/a' });
    const state2 = reducer(state, { type: 'HIDE_MODAL' });
    expect(state2.modal).toBeNull();
  });

  it('handles SHOW_TOAST and HIDE_TOAST', () => {
    const state = reducer(initialState, {
      type: 'SHOW_TOAST', payload: { message: 'Moved', undoId: 'u1' },
    });
    expect(state.toast).toEqual({ message: 'Moved', undoId: 'u1' });
    const state2 = reducer(state, { type: 'HIDE_TOAST' });
    expect(state2.toast).toBeNull();
  });

  it('handles REMOVE_ITEM — removes from items array', () => {
    const state = {
      ...initialState,
      items: [
        { path: '/a', name: 'a', category: 'memory', scopeId: 's1' },
        { path: '/b', name: 'b', category: 'skill', scopeId: 's1' },
      ],
      selectedItemPath: '/a',
    };
    const next = reducer(state, { type: 'REMOVE_ITEM', payload: '/a' });
    expect(next.items).toHaveLength(1);
    expect(next.items[0].path).toBe('/b');
    expect(next.selectedItemPath).toBeNull();
  });

  it('handles UPDATE_ITEM_SCOPE — changes item scopeId', () => {
    const state = {
      ...initialState,
      items: [{ path: '/a', name: 'a', category: 'memory', scopeId: 's1' }],
    };
    const next = reducer(state, {
      type: 'UPDATE_ITEM_SCOPE',
      payload: { path: '/a', newScopeId: 's2', newPath: '/b' },
    });
    expect(next.items[0].scopeId).toBe('s2');
    expect(next.items[0].path).toBe('/b');
  });

  it('handles START_SEARCH and STOP_SEARCH', () => {
    let state = reducer(initialState, { type: 'START_SEARCH' });
    expect(state.searching).toBe(true);
    state = reducer(state, { type: 'STOP_SEARCH' });
    expect(state.searching).toBe(false);
  });
});
