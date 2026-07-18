import { useSearchStore } from "@/shared/stores/search.store";

export default function useGlobalSearch() {
  const store = useSearchStore();
  return {
    query: store.query,
    recentSearches: store.recentSearches,
    setQuery: store.setQuery,
    addRecentSearch: store.addRecentSearch,
  };
}
