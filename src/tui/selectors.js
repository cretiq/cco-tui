export function getVisibleItems(state) {
  let result = state.items;

  if (state.selectedScopeId) {
    result = result.filter(i => i.scopeId === state.selectedScopeId);
  }

  if (state.filters.length > 0) {
    result = result.filter(i => state.filters.includes(i.category));
  }

  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      (i.description || '').toLowerCase().includes(q) ||
      i.path.toLowerCase().includes(q)
    );
  }

  return result;
}

export function getItemsByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

export function getScopeTree(scopes, items) {
  return scopes.map(scope => {
    const scopeItems = items.filter(i => i.scopeId === scope.id);
    const categoryCounts = {};
    for (const item of scopeItems) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
    return { ...scope, categoryCounts, totalItems: scopeItems.length };
  });
}

export function getSelectedItem(state) {
  if (!state.selectedItemPath) return null;
  return state.items.find(i => i.path === state.selectedItemPath) || null;
}
