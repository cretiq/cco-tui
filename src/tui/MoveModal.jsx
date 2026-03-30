import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useListNavigation } from './hooks/useListNavigation.js';

export function MoveModal({ modal, state, dispatch, onMove }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemPaths = modal.paths || [];
  const firstItem = state.items.find(i => i.path === itemPaths[0]);
  const itemName = itemPaths.length === 1
    ? (firstItem?.name || itemPaths[0])
    : `${itemPaths.length} items`;

  useEffect(() => {
    import('../mover.mjs').then(({ getValidDestinations }) => {
      if (firstItem) {
        const dests = getValidDestinations(firstItem, state.scopes);
        setDestinations(dests);
      }
      setLoading(false);
    });
  }, [firstItem?.path]);

  const { cursor, handleInput } = useListNavigation(destinations, {
    isActive: true,
    onSelect: async (dest) => {
      await onMove(itemPaths, dest.id);
      dispatch({ type: 'HIDE_MODAL' });
    },
  });

  useInput((input, key) => {
    if (key.escape) {
      dispatch({ type: 'HIDE_MODAL' });
      return;
    }
    handleInput(input, key);
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      width={42}
    >
      <Text bold color="cyan">  Move: {itemName}</Text>
      <Box marginTop={1}>
        <Text color="#d4d4d4">Select destination scope:</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {loading ? (
          <Text color="#d4d4d4">Loading destinations...</Text>
        ) : destinations.length === 0 ? (
          <Text color="#d4d4d4">No valid destinations</Text>
        ) : (
          destinations.map((dest, i) => (
            <Box key={dest.id}>
              <Text inverse={i === cursor}>
                {'  '}{dest.name}
              </Text>
            </Box>
          ))
        )}
      </Box>
      <Box marginTop={1}>
        <Text color="#d4d4d4">↑↓: select  Enter: confirm  Esc: cancel</Text>
      </Box>
    </Box>
  );
}
