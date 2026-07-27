import { create } from 'zustand';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'Revision' | 'Next Topic' | 'Practice';
  actionLabel: string;
  isUrgent?: boolean;
}

interface RecommendationState {
  recommendations: Recommendation[];
  addRecommendation: (rec: Recommendation) => void;
  removeRecommendation: (id: string) => void;
  setRecommendations: (recs: Recommendation[]) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [
    {
      id: 'rec-1',
      title: 'Revise Graph Traversal',
      description: 'You struggled with this 3 days ago. Time for a quick recap.',
      type: 'Revision',
      actionLabel: 'Revise Now',
      isUrgent: true
    },
    {
      id: 'rec-2',
      title: 'Practice Dynamic Programming',
      description: 'Test your knowledge on Knapsack problem.',
      type: 'Practice',
      actionLabel: 'Take Quiz',
      isUrgent: false
    }
  ],
  addRecommendation: (rec) => set((state) => ({ recommendations: [rec, ...state.recommendations] })),
  removeRecommendation: (id) => set((state) => ({ recommendations: state.recommendations.filter(r => r.id !== id) })),
  setRecommendations: (recs) => set({ recommendations: recs })
}));
