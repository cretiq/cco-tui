import React from 'react';
import { Box, Text } from 'ink';
import { TextInput } from '@inkjs/ui';

export function SearchInput({ search, dispatch, isActive }) {
  if (!isActive) {
    return (
      <Box paddingX={1}>
        <Text color="#d4d4d4">/: search{search ? ` (${search})` : ''}</Text>
      </Box>
    );
  }

  return (
    <Box paddingX={1}>
      <Text>Search: </Text>
      <TextInput
        placeholder="Search..."
        defaultValue={search}
        onChange={value => dispatch({ type: 'SET_SEARCH', payload: value })}
        onSubmit={() => {
          dispatch({ type: 'STOP_SEARCH' });
          dispatch({ type: 'SET_FOCUS', payload: 'main' });
        }}
      />
    </Box>
  );
}
