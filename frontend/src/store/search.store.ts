import { create } from 'zustand';

export interface SearchResult {
  id: string;
  documentId: string;
  documentTitle: string;
  matchedText: string;
  relevanceScore: number;
}

interface SearchState {
  isSearchModalOpen: boolean;
  query: string;
  isSearching: boolean;
  results: SearchResult[];
  recentSearches: string[];
  
  setSearchModalOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setSearching: (isSearching: boolean) => void;
  setResults: (results: SearchResult[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isSearchModalOpen: false,
  query: '',
  isSearching: false,
  results: [],
  recentSearches: ['Kinematics formulas', 'Time complexity of QuickSort'],
  
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  setQuery: (query) => set({ query }),
  setSearching: (isSearching) => set({ isSearching }),
  setResults: (results) => set({ results }),
  addRecentSearch: (query) => set((state) => {
    const unique = new Set([query, ...state.recentSearches]);
    return { recentSearches: Array.from(unique).slice(0, 5) };
  }),
  clearRecentSearches: () => set({ recentSearches: [] })
}));
