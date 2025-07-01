import { useCallback, useRef, useState } from 'react';

export const useCodeHistory = (initialCode: string = '') => {
  const [history, setHistory] = useState<string[]>([initialCode]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoOperation = useRef(false);

  const addToHistory = useCallback((newCode: string, force: boolean = false) => {
    // No agregar al historial si es una operación de undo/redo
    if (isUndoRedoOperation.current && !force) return;
    
    // Evitar agregar el mismo código consecutivamente
    if (history[historyIndex] === newCode) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    
    // Limitar el historial a 50 entradas para evitar uso excesivo de memoria
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      isUndoRedoOperation.current = true;
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      isUndoRedoOperation.current = true;
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const resetUndoRedoFlag = useCallback(() => {
    isUndoRedoOperation.current = false;
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    history,
    historyIndex,
    addToHistory,
    undo,
    redo,
    resetUndoRedoFlag,
    canUndo,
    canRedo,
  };
};