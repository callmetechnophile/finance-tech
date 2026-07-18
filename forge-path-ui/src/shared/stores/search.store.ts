import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  isSearchOpen: boolean;
  query: string;
  recentSearches: string[];
  searchFilters: Record<string, string>;
  setSearchOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  addRecentSearch: (search: string) => void;
  setFilter: (key: string, val: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      isSearchOpen: false,
      query: "",
      recentSearches: [],
      searchFilters: {},
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      setQuery: (query) => set({ query }),
      addRecentSearch: (s) => set((state) => ({ recentSearches: [s, ...state.recentSearches.filter((x) => x !== s)].slice(0, 5) })),
      setFilter: (key, val) => set((s) => ({ searchFilters: { ...s.searchFilters, [key]: val } })),
    }),
    { name: "forge-search" }
  )
);
