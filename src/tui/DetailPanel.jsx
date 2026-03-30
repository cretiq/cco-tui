import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { getSelectedItem } from './selectors.js';
import { readFile } from 'node:fs/promises';

export function DetailPanel({ state, dispatch }) {
  const item = getSelectedItem(state);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!item) { setPreview(''); return; }
    readFile(item.path, 'utf8')
      .then(content => setPreview(content.slice(0, 2000)))
      .catch(() => setPreview('[Unable to read file]'));
  }, [item?.path]);

  if (state.bulk && state.bulkSelected.size > 0) {
    return (
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        <Text bold color="yellow">{state.bulkSelected.size} items selected</Text>
        <Box marginTop={1} flexDirection="column">
          {[...state.bulkSelected].slice(0, 10).map(p => {
            const it = state.items.find(i => i.path === p);
            return <Text key={p} dimColor>{it?.name || p}</Text>;
          })}
          {state.bulkSelected.size > 10 && (
            <Text dimColor>...and {state.bulkSelected.size - 10} more</Text>
          )}
        </Box>
        <Box marginTop={1}>
          <Text dimColor>m: move all  d: delete all  Esc: exit bulk</Text>
        </Box>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box flexDirection="column" flexGrow={1} paddingX={1} alignItems="center" justifyContent="center">
        <Text dimColor>Select an item</Text>
        <Text dimColor>to view details</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1} overflowY="hidden">
      <Text bold>{item.name}</Text>
      <Text dimColor color="magenta">{item.category}</Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold color="cyan">Metadata</Text>
        <Text>  Size:     {item.size || 'unknown'}</Text>
        {item.ctime && <Text>  Created:  {item.ctime.slice(0, 10)}</Text>}
        {item.mtime && <Text>  Modified: {item.mtime.slice(0, 10)}</Text>}
        <Text>  Path:     {item.path}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column" flexGrow={1}>
        <Text bold color="cyan">Preview</Text>
        <Text wrap="truncate">{preview || 'Loading...'}</Text>
      </Box>
    </Box>
  );
}
