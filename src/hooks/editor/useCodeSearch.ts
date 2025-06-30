import { useCallback, useState } from 'react';

export const useCodeSearch = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  const updateSearchMatches = useCallback((text: string, search: string): { position: number; length: number; selection: { start: number; end: number } } | null => {
    if (!search.trim()) {
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      return null;
    }

    const matches: number[] = [];
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();
    let index = 0;

    while (index < textLower.length) {
      const foundIndex = textLower.indexOf(searchLower, index);
      if (foundIndex === -1) break;
      matches.push(foundIndex);
      index = foundIndex + 1;
    }

    setSearchMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
    
    // Retornar información de la primera coincidencia para navegación automática
    if (matches.length > 0) {
      return {
        position: matches[0],
        length: search.length,
        selection: {
          start: matches[0],
          end: matches[0] + search.length,
        },
      };
    }
    return null;
  }, []);

  const searchNext = useCallback(() => {
    if (searchMatches.length === 0) return null;
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    return {
      position: searchMatches[nextIndex],
      length: searchText.length,
      selection: {
        start: searchMatches[nextIndex],
        end: searchMatches[nextIndex] + searchText.length,
      },
    };
  }, [searchMatches, currentMatchIndex, searchText.length]);

  const searchPrevious = useCallback(() => {
    if (searchMatches.length === 0) return null;
    const prevIndex = currentMatchIndex - 1 < 0 ? searchMatches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    return {
      position: searchMatches[prevIndex],
      length: searchText.length,
      selection: {
        start: searchMatches[prevIndex],
        end: searchMatches[prevIndex] + searchText.length,
      },
    };
  }, [searchMatches, currentMatchIndex, searchText.length]);

  const getCurrentMatch = useCallback(() => {
    if (searchMatches.length === 0 || currentMatchIndex === -1) return null;
    return {
      position: searchMatches[currentMatchIndex],
      length: searchText.length,
      selection: {
        start: searchMatches[currentMatchIndex],
        end: searchMatches[currentMatchIndex] + searchText.length,
      },
    };
  }, [searchMatches, currentMatchIndex, searchText.length]);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => {
      const newShowSearch = !prev;
      if (!newShowSearch) {
        setSearchText('');
        setSearchMatches([]);
        setCurrentMatchIndex(-1);
      }
      return newShowSearch;
    });
  }, []);

  return {
    showSearch,
    searchText,
    searchMatches,
    currentMatchIndex,
    setSearchText,
    updateSearchMatches,
    searchNext,
    searchPrevious,
    getCurrentMatch,
    toggleSearch,
  };
};