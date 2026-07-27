import { create } from 'zustand';

export interface Artifact {
  id: string;
  title: string;
  type: 'Smart Notes' | 'Flashcards' | 'Quiz' | 'Summary' | 'Revision Sheet';
  description: string;
  content?: string;
  createdAt: string;
}

interface ArtifactState {
  artifacts: Artifact[];
  isGeneratingArtifact: boolean;
  addArtifact: (artifact: Artifact) => void;
  removeArtifact: (id: string) => void;
  setGeneratingArtifact: (isGenerating: boolean) => void;
}

export const useArtifactStore = create<ArtifactState>((set) => ({
  artifacts: [
    {
      id: 'mock-1',
      title: 'Binary Search Trees',
      type: 'Smart Notes',
      description: 'Automatically generated notes from your recent conversation.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-2',
      title: 'Algorithm Complexities',
      type: 'Flashcards',
      description: '12 cards generated to help you practice.',
      createdAt: new Date().toISOString()
    }
  ],
  isGeneratingArtifact: false,
  addArtifact: (artifact) => set((state) => ({ artifacts: [artifact, ...state.artifacts] })),
  removeArtifact: (id) => set((state) => ({ artifacts: state.artifacts.filter(a => a.id !== id) })),
  setGeneratingArtifact: (isGenerating) => set({ isGeneratingArtifact: isGenerating })
}));
