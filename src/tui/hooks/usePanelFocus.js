import { useCallback } from 'react';

const PANELS = ['sidebar', 'main', 'detail'];

export function usePanelFocus(state, dispatch) {
  const focusNext = useCallback(() => {
    const idx = PANELS.indexOf(state.focus);
    const next = PANELS[(idx + 1) % PANELS.length];
    dispatch({ type: 'SET_FOCUS', payload: next });
  }, [state.focus, dispatch]);

  const focusPrev = useCallback(() => {
    const idx = PANELS.indexOf(state.focus);
    const next = PANELS[(idx - 1 + PANELS.length) % PANELS.length];
    dispatch({ type: 'SET_FOCUS', payload: next });
  }, [state.focus, dispatch]);

  return { focusNext, focusPrev, isFocused: (panel) => state.focus === panel };
}
