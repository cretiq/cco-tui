import { useState, useCallback, useEffect } from 'react';
import { KEYS } from '../keymaps.js';

export function useListNavigation(items, { isActive = true, onSelect } = {}) {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (cursor >= items.length && items.length > 0) {
      setCursor(items.length - 1);
    }
  }, [items.length, cursor]);

  const handleInput = useCallback((input, key) => {
    if (!isActive || items.length === 0) return false;

    if (key.upArrow || input === KEYS.up) {
      setCursor(c => Math.max(0, c - 1));
      return true;
    }
    if (key.downArrow || input === KEYS.down) {
      setCursor(c => Math.min(items.length - 1, c + 1));
      return true;
    }
    if (key.return && onSelect) {
      onSelect(items[cursor], cursor);
      return true;
    }
    return false;
  }, [isActive, items, cursor, onSelect]);

  return { cursor, setCursor, handleInput, currentItem: items[cursor] || null };
}
