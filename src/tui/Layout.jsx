import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { BottomBar } from './BottomBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { FilterBar } from './FilterBar.jsx';
import { ItemList } from './ItemList.jsx';
import { DetailPanel } from './DetailPanel.jsx';

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
              <Sidebar state={state} dispatch={dispatch} />
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
            <Text bold color="cyan">
              {state.bulk ? `Items  BULK — ${state.bulkSelected.size} selected` : 'Items'}
            </Text>
          </Box>
          <Box paddingX={1}>
            <FilterBar filters={state.filters} dispatch={dispatch} />
          </Box>
          <Box flexDirection="column" flexGrow={1} paddingX={1}>
            <ItemList state={state} dispatch={dispatch} />
          </Box>
        </Box>

        {showDetail && (
          <Box
            width={DETAIL_WIDTH}
            flexDirection="column"
            borderStyle="single"
            borderColor={focusColor('detail')}
          >
            <DetailPanel state={state} dispatch={dispatch} />
          </Box>
        )}
      </Box>

      <BottomBar view={state.view} />
    </Box>
  );
}
