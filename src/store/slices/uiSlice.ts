import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  inspectorOpen: boolean;
  inspectorEntity: { id: string; type: string } | null;
  activeTab: string;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'light',
  commandPaletteOpen: false,
  inspectorOpen: false,
  inspectorEntity: null,
  activeTab: 'overview',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) { state.theme = action.payload; },
    toggleTheme(state) { state.theme = state.theme === 'light' ? 'dark' : 'light'; },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) { state.commandPaletteOpen = action.payload; },
    openInspector(state, action: PayloadAction<{ id: string; type: string }>) {
      state.inspectorOpen = true;
      state.inspectorEntity = action.payload;
    },
    closeInspector(state) { state.inspectorOpen = false; state.inspectorEntity = null; },
    setActiveTab(state, action: PayloadAction<string>) { state.activeTab = action.payload; },
  },
});

export const { toggleSidebar, setTheme, toggleTheme, setCommandPaletteOpen, openInspector, closeInspector, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
