import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface Artifact {
  id: string;
  title: string;
  artifactType: string;
  description: string;
  content?: any;
  createdAt: string;
  sourceConversationId?: string;
}

interface ArtifactState {
  artifacts: Artifact[];
  isGeneratingArtifact: boolean;
  addArtifact: (artifact: Artifact) => void;
  removeArtifact: (id: string) => void;
  setGeneratingArtifact: (isGenerating: boolean) => void;
  fetchArtifacts: () => Promise<void>;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
}

export const useArtifactStore = create<ArtifactState>((set) => ({
  artifacts: [],
  isGeneratingArtifact: false,
  addArtifact: (artifact) => set((state) => ({ artifacts: [artifact, ...state.artifacts] })),
  removeArtifact: (id) => set((state) => ({ artifacts: state.artifacts.filter(a => a.id !== id) })),
  setGeneratingArtifact: (isGenerating) => set({ isGeneratingArtifact: isGenerating }),
  fetchArtifacts: async () => {
    try {
      const res = await apiClient.get('/workspace/artifacts');
      set({ artifacts: res.data.data.artifacts });
    } catch (e) {
      console.error("Failed to fetch artifacts", e);
    }
  },
  updateArtifact: (id, updates) => set((state) => ({
    artifacts: state.artifacts.map(a => a.id === id ? { ...a, ...updates } : a)
  }))
}));
