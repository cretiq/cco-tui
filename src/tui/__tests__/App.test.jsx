import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import App from '../App.jsx';

const mockScanData = {
  scopes: [
    { id: 's1', name: 'Global', type: 'global', parentId: null },
    { id: 's2', name: 'my-project', type: 'project', parentId: null },
  ],
  items: [
    {
      path: '/tmp/test-memory.md', name: 'test-memory.md', category: 'memory',
      scopeId: 's1', size: '1 KB', sizeBytes: 1024,
      mtime: '2026-03-15T00:00:00Z', ctime: '2026-03-10T00:00:00Z',
    },
    {
      path: '/tmp/test-skill.md', name: 'test-skill.md', category: 'skill',
      scopeId: 's1', size: '2 KB', sizeBytes: 2048,
      mtime: '2026-03-20T00:00:00Z', ctime: '2026-03-12T00:00:00Z',
    },
  ],
  counts: { memory: 1, skill: 1, total: 2 },
};

describe('App integration', () => {
  it('renders layout after scan completes', async () => {
    const scanFn = () => Promise.resolve(mockScanData);
    const { lastFrame } = render(<App scanFn={scanFn} />);

    // Wait for scan to complete
    await new Promise(r => setTimeout(r, 100));

    const frame = lastFrame();
    expect(frame).toContain('Scope Tree');
    expect(frame).toContain('Global');
  });

  it('opens help modal with ?', async () => {
    const scanFn = () => Promise.resolve(mockScanData);
    const { lastFrame, stdin } = render(<App scanFn={scanFn} />);

    await new Promise(r => setTimeout(r, 100));

    stdin.write('?');
    await new Promise(r => setTimeout(r, 50));

    const frame = lastFrame();
    expect(frame).toContain('Keyboard Shortcuts');
  });
});
