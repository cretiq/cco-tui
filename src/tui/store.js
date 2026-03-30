export const initialState = {
  scopes: [],
  items: [],
  counts: {},
  selectedScopeId: null,
  selectedItemPath: null,
  view: 'items',
  filters: [],
  search: '',
  focus: 'sidebar',
  bulk: false,
  bulkSelected: new Set(),
  modal: null,
  toast: null,
  loading: true,
  searching: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SCAN_COMPLETE':
      return {
        ...state,
        scopes: action.payload.scopes,
        items: action.payload.items,
        counts: action.payload.counts,
        loading: false,
      };

    case 'SET_SCOPE':
      return { ...state, selectedScopeId: action.payload, selectedItemPath: null };

    case 'SELECT_ITEM':
      return { ...state, selectedItemPath: action.payload };

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_FILTER': {
      const cat = action.payload;
      const filters = state.filters.includes(cat)
        ? state.filters.filter(f => f !== cat)
        : [...state.filters, cat];
      return { ...state, filters };
    }

    case 'SET_SEARCH':
      return { ...state, search: action.payload };

    case 'SET_FOCUS':
      return { ...state, focus: action.payload };

    case 'TOGGLE_BULK':
      return { ...state, bulk: !state.bulk, bulkSelected: new Set() };

    case 'BULK_TOGGLE_ITEM': {
      const next = new Set(state.bulkSelected);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, bulkSelected: next };
    }

    case 'SHOW_MODAL':
      return { ...state, modal: action.payload };

    case 'HIDE_MODAL':
      return { ...state, modal: null };

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.path !== action.payload),
        selectedItemPath: state.selectedItemPath === action.payload ? null : state.selectedItemPath,
        bulkSelected: (() => {
          const s = new Set(state.bulkSelected);
          s.delete(action.payload);
          return s;
        })(),
      };

    case 'UPDATE_ITEM_SCOPE': {
      const { path, newScopeId, newPath } = action.payload;
      return {
        ...state,
        items: state.items.map(i =>
          i.path === path ? { ...i, scopeId: newScopeId, path: newPath } : i
        ),
      };
    }

    case 'START_SEARCH':
      return { ...state, searching: true };

    case 'STOP_SEARCH':
      return { ...state, searching: false };

    default:
      return state;
  }
}
