import React from 'react';
import { Box, Text, useInput } from 'ink';

const SECTIONS = [
  {
    title: 'Global',
    keys: [
      ['q', 'Quit'],
      ['?', 'Help'],
      ['b', 'Budget view'],
      ['s', 'Security scan'],
      ['/', 'Search'],
      ['Tab', 'Next panel'],
      ['S-Tab', 'Prev panel'],
    ],
  },
  {
    title: 'Navigation',
    keys: [
      ['j / ↓', 'Move down'],
      ['k / ↑', 'Move up'],
      ['Enter', 'Select / expand'],
      ['Esc', 'Back / cancel'],
    ],
  },
  {
    title: 'Actions',
    keys: [
      ['m', 'Move item(s)'],
      ['d', 'Delete item(s)'],
      ['v', 'Bulk select mode'],
      ['Space', 'Toggle checkbox'],
    ],
  },
];

export function HelpModal({ dispatch }) {
  useInput((input, key) => {
    if (key.escape || input === '?' || input === 'q') {
      dispatch({ type: 'HIDE_MODAL' });
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      width={44}
    >
      <Text bold color="cyan">  Keyboard Shortcuts</Text>
      {SECTIONS.map(section => (
        <Box key={section.title} flexDirection="column" marginTop={1}>
          <Text bold>{section.title}</Text>
          {section.keys.map(([key, action]) => (
            <Box key={key}>
              <Text bold color="cyan">{key.padEnd(10)}</Text>
              <Text>{action}</Text>
            </Box>
          ))}
        </Box>
      ))}
      <Box marginTop={1}>
        <Text color="#d4d4d4">Press Esc or ? to close</Text>
      </Box>
    </Box>
  );
}
