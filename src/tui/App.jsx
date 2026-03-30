import React, { useReducer, useEffect } from 'react';
import { useApp, useInput } from 'ink';
import { Layout } from './Layout.jsx';
import { reducer, initialState } from './store.js';
import { usePanelFocus } from './hooks/usePanelFocus.js';

export default function App({ scanDir, scanFn }) {
  const { exit } = useApp();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { focusNext, focusPrev } = usePanelFocus(state, dispatch);

  useEffect(() => {
    const doScan = scanFn || (() => import('../scanner.mjs').then(m => m.scan()));
    doScan().then(data => {
      dispatch({ type: 'SCAN_COMPLETE', payload: data });
    });
  }, [scanFn]);

  useInput((input, key) => {
    // Modal captures all input
    if (state.modal) return;

    if (input === 'q') { exit(); return; }
    if (key.tab && key.shift) { focusPrev(); return; }
    if (key.tab) { focusNext(); return; }

    // View switches
    if (input === 'b') {
      dispatch({ type: 'SET_VIEW', payload: state.view === 'budget' ? 'items' : 'budget' });
      return;
    }
    if (input === 's') {
      dispatch({ type: 'SET_VIEW', payload: state.view === 'security' ? 'items' : 'security' });
      return;
    }
    if (input === '/') {
      dispatch({ type: 'START_SEARCH' });
      return;
    }
    if (key.escape) {
      if (state.filterFocused) { dispatch({ type: 'SET_FILTER_FOCUSED', payload: false }); return; }
      if (state.searching) { dispatch({ type: 'STOP_SEARCH' }); return; }
      if (state.view !== 'items') { dispatch({ type: 'SET_VIEW', payload: 'items' }); return; }
      if (state.bulk) { dispatch({ type: 'TOGGLE_BULK' }); return; }
      if (state.search) { dispatch({ type: 'SET_SEARCH', payload: '' }); return; }
    }
    if (input === '?') {
      dispatch({ type: 'SHOW_MODAL', payload: { type: 'help' } });
      return;
    }
    if (input === 'v' && state.focus === 'main') {
      dispatch({ type: 'TOGGLE_BULK' });
      return;
    }
  });

  return <Layout state={state} dispatch={dispatch} />;
}
