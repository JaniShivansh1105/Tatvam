import { create } from 'zustand';

export interface UploadItem {
  id: string;
  file: File;
  progress: number; // 0 to 100
  status: 'Queued' | 'Uploading' | 'Processing' | 'Success' | 'Failed';
  error?: string;
}

interface UploadState {
  isUploadModalOpen: boolean;
  queue: UploadItem[];
  
  setUploadModalOpen: (isOpen: boolean) => void;
  addToQueue: (items: UploadItem[]) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: UploadItem['status'], error?: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  isUploadModalOpen: false,
  queue: [],
  
  setUploadModalOpen: (isOpen) => set({ isUploadModalOpen: isOpen }),
  
  addToQueue: (items) => set((state) => ({ queue: [...state.queue, ...items] })),
  
  updateProgress: (id, progress) => set((state) => ({
    queue: state.queue.map(item => item.id === id ? { ...item, progress } : item)
  })),
  
  updateStatus: (id, status, error) => set((state) => ({
    queue: state.queue.map(item => item.id === id ? { ...item, status, error } : item)
  })),
  
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter(item => item.id !== id)
  })),
  
  clearQueue: () => set({ queue: [] })
}));
