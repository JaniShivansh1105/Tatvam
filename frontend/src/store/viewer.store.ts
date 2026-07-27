import { create } from 'zustand';
import { KnowledgeDocument } from './knowledge.store';

interface ViewerState {
  activeDocument: KnowledgeDocument | null;
  isOpen: boolean;
  currentPage: number;
  zoomLevel: number;
  
  openDocument: (doc: KnowledgeDocument) => void;
  closeViewer: () => void;
  setCurrentPage: (page: number) => void;
  setZoomLevel: (zoom: number) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  activeDocument: null,
  isOpen: false,
  currentPage: 1,
  zoomLevel: 100,
  
  openDocument: (doc) => set({ activeDocument: doc, isOpen: true, currentPage: 1, zoomLevel: 100 }),
  closeViewer: () => set({ activeDocument: null, isOpen: false }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom })
}));
