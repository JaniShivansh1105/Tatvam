import { create } from 'zustand';

export interface ConceptMastery {
  concept: string;
  masteryLevel: number; // 0 to 1
  recentDelta: number; // e.g. +0.15
}

interface ProgressState {
  currentTopic: string;
  learningGoal: string;
  weakConcepts: string[];
  recentMasteryChanges: ConceptMastery[];
  
  setCurrentTopic: (topic: string) => void;
  setLearningGoal: (goal: string) => void;
  setWeakConcepts: (concepts: string[]) => void;
  addMasteryChange: (change: ConceptMastery) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  currentTopic: 'Algorithms & Data Structures',
  learningGoal: 'Master Dynamic Programming',
  weakConcepts: ['Recursion', 'Memoization'],
  recentMasteryChanges: [
    { concept: 'Binary Trees', masteryLevel: 0.8, recentDelta: 0.15 },
    { concept: 'Graph Traversal', masteryLevel: 0.4, recentDelta: 0.05 }
  ],
  
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setLearningGoal: (goal) => set({ learningGoal: goal }),
  setWeakConcepts: (concepts) => set({ weakConcepts: concepts }),
  addMasteryChange: (change) => set((state) => ({ 
    recentMasteryChanges: [change, ...state.recentMasteryChanges.filter(c => c.concept !== change.concept)].slice(0, 5) 
  }))
}));
