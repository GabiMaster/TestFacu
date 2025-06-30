import { useCallback, useState } from 'react';

export const useCodeHistory = (initialCode: string = '') => {
  const [history, setHistory] = useState<string[]>([initialCode]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback((newCode: string) => {
    // Evitar agregar el mismo código consecutivamente
    if (history[historyIndex] === newCode) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    history,
    historyIndex,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};