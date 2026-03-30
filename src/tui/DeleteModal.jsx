import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

export function DeleteModal({ modal, state, dispatch, onDelete }) {
  const [focused, setFocused] = useState('cancel');
  const paths = modal.paths || [];
  const items = paths.map(p => state.items.find(i => i.path === p)).filter(Boolean);
  const label = items.length === 1 ? items[0].name : `${items.length} items`;

  useInput((input, key) => {
    if (key.escape) { dispatch({ type: 'HIDE_MODAL' }); return; }
    if (key.tab) { setFocused(f => f === 'delete' ? 'cancel' : 'delete'); return; }
    if (key.return) {
      if (focused === 'delete') {
        onDelete(paths);
        dispatch({ type: 'HIDE_MODAL' });
      } else {
        dispatch({ type: 'HIDE_MODAL' });
      }
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="red"
      paddingX={2}
      paddingY={1}
      width={36}
    >
      <Text bold color="red">  Delete item?</Text>
      <Box marginTop={1} flexDirection="column">
        <Text>{label}</Text>
        {items.length === 1 && (
          <Text color="#d4d4d4">{items[0].category} · {items[0].scopeId}</Text>
        )}
      </Box>
      <Box marginTop={1}>
        <Text color="#d4d4d4">This cannot be undone.</Text>
      </Box>
      <Box marginTop={1} gap={2}>
        <Text inverse={focused === 'delete'} color="red">[Delete]</Text>
        <Text inverse={focused === 'cancel'} color="#d4d4d4">[Cancel]</Text>
      </Box>
    </Box>
  );
}
