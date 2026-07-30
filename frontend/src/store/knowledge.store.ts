import { create } from 'zustand';

export interface KnowledgeDocument {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'DOCX' | 'PPT' | 'TXT' | 'Markdown' | 'Image' | 'Link' | 'Video';
  size: number;
  uploadDate: string;
  status: 'Processing' | 'Indexed' | 'Failed';
  lastUsed: string;
  source: 'Upload' | 'Generated' | 'Shared';
  isPinned: boolean;
  isFavorite: boolean;
  folderId?: string;
  fileUrl?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface KnowledgeState {
  documents: KnowledgeDocument[];
  folders: Folder[];
  activeFolderId: string | null;
  
  setDocuments: (docs: KnowledgeDocument[]) => void;
  addDocument: (doc: KnowledgeDocument) => void;
  updateDocumentStatus: (id: string, status: KnowledgeDocument['status']) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setActiveFolder: (id: string | null) => void;
  removeDocument: (id: string) => void;
  renameDocument: (id: string, newTitle: string) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  documents: [],
  folders: [
    { id: 'f-1', name: 'Physics 101', color: 'blue' },
    { id: 'f-2', name: 'Algorithms', color: 'indigo' }
  ],
  activeFolderId: null,
  
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  updateDocumentStatus: (id, status) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, status } : d)
  })),
  togglePin: (id) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d)
  })),
  toggleFavorite: (id) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)
  })),
  setActiveFolder: (id) => set({ activeFolderId: id }),
  removeDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  renameDocument: (id, newTitle) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, title: newTitle } : d)
  }))
}));
