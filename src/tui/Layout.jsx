import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { BottomBar } from './BottomBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { FilterBar } from './FilterBar.jsx';
import { ItemList } from './ItemList.jsx';
import { DetailPanel } from './DetailPanel.jsx';
import { MoveModal } from './MoveModal.jsx';
import { DeleteModal } from './DeleteModal.jsx';

const SIDEBAR_WIDTH = 24;
const DETAIL_WIDTH = 34;

export function Layout({ state, dispatch }) {
  const { columns, rows } = useTerminalSize();
  const showDetail = columns >= 100;
  const showSidebar = columns >= 60;

  const focusColor = (panel) => state.focus === panel ? 'cyan' : 'gray';

  const handleMove = async (paths, destScopeId) => {
    const { moveItem } = await import('../mover.mjs');
    const { backupBeforeMutation } = await import('../history.mjs');
    for (const p of paths) {
      const item = state.items.find(i => i.path === p);
      if (!item) continue;
      await backupBeforeMutation(item.path, {
        op: 'move', desc: `Move ${item.name}`, category: item.category, itemName: item.name,
      });
      const result = await moveItem(item, destScopeId, state.scopes);
      if (result.ok) {
        dispatch({
          type: 'UPDATE_ITEM_SCOPE',
          payload: { path: p, newScopeId: destScopeId, newPath: result.to || p },
        });
      }
    }
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: `Moved ${paths.length} item(s)` },
    });
  };

  const handleDelete = async (paths) => {
    const { deleteItem } = await import('../mover.mjs');
    const { backupBeforeMutation } = await import('../history.mjs');
    for (const p of paths) {
      const item = state.items.find(i => i.path === p);
      if (!item) continue;
      await backupBeforeMutation(item.path, {
        op: 'delete', desc: `Delete ${item.name}`, category: item.category, itemName: item.name,
      });
      const result = await deleteItem(item, state.scopes);
      if (result.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: p });
      }
    }
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: `Deleted ${paths.length} item(s)` },
    });
  };

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
          {state.modal?.type === 'help' ? (
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text dimColor>Help modal (coming soon)</Text>
            </Box>
          ) : state.modal?.type === 'move' ? (
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <MoveModal modal={state.modal} state={state} dispatch={dispatch} onMove={handleMove} />
            </Box>
          ) : state.modal?.type === 'delete' ? (
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <DeleteModal modal={state.modal} state={state} dispatch={dispatch} onDelete={handleDelete} />
            </Box>
          ) : (
            <>
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
            </>
          )}
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
