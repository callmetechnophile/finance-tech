import { useState, useEffect } from "react";
import { searchMockDatabase, SearchRecord } from "../search-providers";

export default function useSearchProvider(query: string) {
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(() => {
      const filtered = searchMockDatabase(query);
      setResults(filtered);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { results, isSearching };
}
