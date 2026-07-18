import { useSearchStore } from "@/shared/stores/search.store";
export default function useSearch() {
  const store = useSearchStore();
  return {
    isSearchOpen: store.isSearchOpen,
    query: store.query,
    recentSearches: store.recentSearches,
    searchFilters: store.searchFilters,
    setSearchOpen: store.setSearchOpen,
    setQuery: store.setQuery,
    addRecentSearch: store.addRecentSearch,
    setFilter: store.setFilter,
  };
}
