import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { BottomBar } from './BottomBar.jsx';

const SIDEBAR_WIDTH = 24;
const DETAIL_WIDTH = 34;

export function Layout({ state, dispatch }) {
  const { columns, rows } = useTerminalSize();
  const showDetail = columns >= 100;
  const showSidebar = columns >= 60;

  const focusColor = (panel) => state.focus === panel ? 'cyan' : 'gray';

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Box flexGrow={1} flexDirection="row">
        {showSidebar && (
          <Box
            width={SIDEBAR_WIDTH}
            flexDirection="column"
            borderStyle="single"
            borderColor={focusColor('sidebar')}
          >
            <Box paddingX={1}>
              <Text bold color="cyan">Scope Tree</Text>
            </Box>
            <Box flexDirection="column" flexGrow={1} paddingX={1}>
              <Text dimColor>Loading...</Text>
            </Box>
          </Box>
        )}

        <Box
          flexGrow={1}
          flexDirection="column"
          borderStyle="single"
          borderColor={focusColor('main')}
        >
          <Box paddingX={1}>
            <Text bold color="cyan">Items</Text>
          </Box>
          <Box flexDirection="column" flexGrow={1} paddingX={1}>
            <Text dimColor>{state.loading ? 'Scanning...' : 'No items'}</Text>
          </Box>
        </Box>

        {showDetail && (
          <Box
            width={DETAIL_WIDTH}
            flexDirection="column"
            borderStyle="single"
            borderColor={focusColor('detail')}
          >
            <Box paddingX={1}>
              <Text bold color="cyan">Detail</Text>
            </Box>
            <Box flexDirection="column" flexGrow={1} paddingX={1}>
              <Text dimColor>Select an item to view details</Text>
            </Box>
          </Box>
        )}
      </Box>

      <BottomBar view={state.view} />
    </Box>
  );
}
