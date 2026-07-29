import { create } from 'zustand';

type PanelView = 'context' | 'artifacts' | 'progress' | 'history';

interface WorkspaceState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;

  activeRightPanel: PanelView;
  setActiveRightPanel: (view: PanelView) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  isRightPanelOpen: true,
  toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),

  activeRightPanel: 'context',
  setActiveRightPanel: (view) => set({ activeRightPanel: view }),
}));
