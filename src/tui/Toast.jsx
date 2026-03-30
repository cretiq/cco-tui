import React, { useEffect } from 'react';
import { Box, Text } from 'ink';

export function Toast({ toast, dispatch }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <Box justifyContent="flex-end" width="100%">
      <Box borderStyle="round" borderColor="green" paddingX={1}>
        <Text color="green">{toast.message}</Text>
        {toast.undoId && <Text color="#d4d4d4">  [u: undo]</Text>}
      </Box>
    </Box>
  );
}
