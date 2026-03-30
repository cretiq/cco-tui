import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useListNavigation } from './hooks/useListNavigation.js';

const SEVERITY_COLORS = {
  critical: 'red',
  high: 'red',
  medium: 'yellow',
  low: 'blue',
};

const SEVERITY_ICONS = {
  critical: '✗',
  high: '✗',
  medium: '⚠',
  low: 'ℹ',
};

export function SecurityView({ state, dispatch }) {
  const isActive = state.focus === 'main' && state.view === 'security';
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState(null);

  useEffect(() => {
    (async () => {
      const { introspectServers } = await import('../mcp-introspector.mjs');
      const { runSecurityScan } = await import('../security-scanner.mjs');
      const mcpItems = state.items.filter(i => i.category === 'mcp');
      const introspection = await introspectServers(mcpItems);
      const result = await runSecurityScan(introspection, {
        items: state.items,
        scopes: state.scopes,
      });
      setReport(result);
      setLoading(false);
    })();
  }, []);

  const findings = report?.findings || [];
  const filtered = severityFilter
    ? findings.filter(f => f.severity === severityFilter)
    : findings;

  const { cursor, handleInput, currentItem } = useListNavigation(filtered, {
    isActive,
    onSelect: (finding) => {
      dispatch({ type: 'SELECT_ITEM', payload: finding.location });
    },
  });

  useInput((input, key) => {
    if (!isActive) return;
    if (handleInput(input, key)) return;
    if (input === 'f') {
      const severities = ['critical', 'high', 'medium', 'low'];
      const idx = severities.indexOf(severityFilter);
      setSeverityFilter(idx === severities.length - 1 ? null : severities[idx + 1]);
    }
  });

  if (loading) {
    return <Box paddingX={1}><Text dimColor>Running security scan...</Text></Box>;
  }

  const counts = report?.severityCounts || {};

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      <Box gap={2}>
        <Text color="#a3a3a3">Scanned {report?.totalTools || 0} tools from {report?.totalServers || 0} servers</Text>
      </Box>
      <Box gap={1} marginTop={1}>
        <Text inverse={!severityFilter} dimColor={!!severityFilter}>[All]</Text>
        {['critical', 'high', 'medium', 'low'].map(s => (
          <Text
            key={s}
            inverse={severityFilter === s}
            color={SEVERITY_COLORS[s]}
          >
            [{s} {counts[s] || 0}]
          </Text>
        ))}
      </Box>
      <Box marginTop={1} flexDirection="column">
        {filtered.length === 0 ? (
          <Text color="green">No findings. All clear.</Text>
        ) : (
          filtered.map((f, i) => {
            const selected = i === cursor && isActive;
            return (
              <Box key={`${f.location}-${f.pattern}-${i}`} flexDirection="column">
                <Box>
                  <Text color={SEVERITY_COLORS[f.severity]}>
                    {SEVERITY_ICONS[f.severity]}{' '}
                  </Text>
                  <Text inverse={selected} bold={selected} color={selected ? undefined : 'white'}>
                    {f.threat}
                  </Text>
                </Box>
                <Box marginLeft={4}>
                  <Text color="#a3a3a3">{f.location}</Text>
                </Box>
                <Box marginLeft={4}>
                  <Text color="#737373">{f.snippet?.slice(0, 60)}</Text>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
