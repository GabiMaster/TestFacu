import { useCallback, useState } from 'react';

interface NavigationPosition {
  line: number;
  column: number;
  index: number;
}

interface UseCodeNavigationProps {
  code: string;
  selection: { start: number; end: number };
  onSelectionChange: (selection: { start: number; end: number }) => void;
  onCursorPositionChange: (position: number) => void;
}

export const useCodeNavigation = ({
  code,
  selection,
  onSelectionChange,
  onCursorPositionChange,
}: UseCodeNavigationProps) => {
  const [navigationHistory, setNavigationHistory] = useState<NavigationPosition[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Función para obtener información de línea y columna desde una posición
  const getLineAndColumn = useCallback((position: number): NavigationPosition => {
    const lines = code.substring(0, position).split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;
    
    return {
      line,
      column,
      index: position,
    };
  }, [code]);

  // Función para obtener posición desde línea y columna
  const getPositionFromLineColumn = useCallback((line: number, column: number): number => {
    const lines = code.split('\n');
    let position = 0;
    
    for (let i = 0; i < Math.min(line, lines.length - 1); i++) {
      position += lines[i].length + 1; // +1 para el salto de línea
    }
    
    // Asegurar que la columna no exceda la longitud de la línea
    const targetLine = lines[line] || '';
    position += Math.min(column, targetLine.length);
    
    return position;
  }, [code]);

  // Agregar posición al historial de navegación
  const addToNavigationHistory = useCallback((position: NavigationPosition) => {
    setNavigationHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(position);
      
      // Limitar historial a 50 elementos
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Obtener información actual del cursor
  const getCurrentPosition = useCallback((): NavigationPosition => {
    return getLineAndColumn(selection.start);
  }, [selection.start, getLineAndColumn]);

  // Navegar a una línea específica
  const goToLine = useCallback((lineNumber: number) => {
    const lines = code.split('\n');
    const targetLine = Math.max(0, Math.min(lineNumber - 1, lines.length - 1));
    const position = getPositionFromLineColumn(targetLine, 0);
    
    onSelectionChange({ start: position, end: position });
    onCursorPositionChange(position);
    
    // Agregar al historial
    const newPosition = getLineAndColumn(position);
    addToNavigationHistory(newPosition);
  }, [code, onSelectionChange, onCursorPositionChange, getPositionFromLineColumn, getLineAndColumn, addToNavigationHistory]);

  // Navegar al inicio de la línea
  const goToLineStart = useCallback(() => {
    const currentPos = getCurrentPosition();
    const position = getPositionFromLineColumn(currentPos.line, 0);
    
    onSelectionChange({ start: position, end: position });
    onCursorPositionChange(position);
  }, [getCurrentPosition, getPositionFromLineColumn, onSelectionChange, onCursorPositionChange]);

  // Navegar al final de la línea
  const goToLineEnd = useCallback(() => {
    const currentPos = getCurrentPosition();
    const lines = code.split('\n');
    const currentLine = lines[currentPos.line] || '';
    const position = getPositionFromLineColumn(currentPos.line, currentLine.length);
    
    onSelectionChange({ start: position, end: position });
    onCursorPositionChange(position);
  }, [getCurrentPosition, code, getPositionFromLineColumn, onSelectionChange, onCursorPositionChange]);

  // Navegar un carácter hacia la izquierda
  const navigateLeft = useCallback(() => {
    const newPosition = Math.max(0, selection.start - 1);
    onSelectionChange({ start: newPosition, end: newPosition });
    onCursorPositionChange(newPosition);
  }, [selection.start, onSelectionChange, onCursorPositionChange]);

  // Navegar un carácter hacia la derecha
  const navigateRight = useCallback(() => {
    const newPosition = Math.min(code.length, selection.start + 1);
    onSelectionChange({ start: newPosition, end: newPosition });
    onCursorPositionChange(newPosition);
  }, [code.length, selection.start, onSelectionChange, onCursorPositionChange]);

  // Navegar por palabras hacia la izquierda
  const navigateWordLeft = useCallback(() => {
    const currentPos = selection.start;
    let newPos = currentPos - 1;
    
    // Saltar espacios
    while (newPos > 0 && /\s/.test(code[newPos])) {
      newPos--;
    }
    
    // Encontrar inicio de palabra
    while (newPos > 0 && /\w/.test(code[newPos - 1])) {
      newPos--;
    }
    
    onSelectionChange({ start: newPos, end: newPos });
    onCursorPositionChange(newPos);
  }, [selection.start, code, onSelectionChange, onCursorPositionChange]);

  // Navegar por palabras hacia la derecha
  const navigateWordRight = useCallback(() => {
    const currentPos = selection.start;
    let newPos = currentPos;
    
    // Saltar espacios
    while (newPos < code.length && /\s/.test(code[newPos])) {
      newPos++;
    }
    
    // Encontrar final de palabra
    while (newPos < code.length && /\w/.test(code[newPos])) {
      newPos++;
    }
    
    onSelectionChange({ start: newPos, end: newPos });
    onCursorPositionChange(newPos);
  }, [selection.start, code, onSelectionChange, onCursorPositionChange]);

  // Navegar al inicio del documento
  const goToDocumentStart = useCallback(() => {
    onSelectionChange({ start: 0, end: 0 });
    onCursorPositionChange(0);
    
    const newPosition = getLineAndColumn(0);
    addToNavigationHistory(newPosition);
  }, [onSelectionChange, onCursorPositionChange, getLineAndColumn, addToNavigationHistory]);

  // Navegar al final del documento
  const goToDocumentEnd = useCallback(() => {
    const position = code.length;
    onSelectionChange({ start: position, end: position });
    onCursorPositionChange(position);
    
    const newPosition = getLineAndColumn(position);
    addToNavigationHistory(newPosition);
  }, [code.length, onSelectionChange, onCursorPositionChange, getLineAndColumn, addToNavigationHistory]);

  // Navegar a la siguiente ocurrencia de un carácter
  const goToNextOccurrence = useCallback((character: string, fromPosition?: number) => {
    const startPos = fromPosition || selection.start + 1;
    const nextIndex = code.indexOf(character, startPos);
    
    if (nextIndex !== -1) {
      onSelectionChange({ start: nextIndex, end: nextIndex });
      onCursorPositionChange(nextIndex);
      
      const newPosition = getLineAndColumn(nextIndex);
      addToNavigationHistory(newPosition);
      return true;
    }
    
    return false;
  }, [code, selection.start, onSelectionChange, onCursorPositionChange, getLineAndColumn, addToNavigationHistory]);

  // Navegar a la ocurrencia anterior de un carácter
  const goToPreviousOccurrence = useCallback((character: string, fromPosition?: number) => {
    const startPos = fromPosition || selection.start - 1;
    const prevIndex = code.lastIndexOf(character, startPos);
    
    if (prevIndex !== -1) {
      onSelectionChange({ start: prevIndex, end: prevIndex });
      onCursorPositionChange(prevIndex);
      
      const newPosition = getLineAndColumn(prevIndex);
      addToNavigationHistory(newPosition);
      return true;
    }
    
    return false;
  }, [code, selection.start, onSelectionChange, onCursorPositionChange, getLineAndColumn, addToNavigationHistory]);

  // Encontrar la llave/paréntesis correspondiente
  const findMatchingBracket = useCallback((position?: number) => {
    const pos = position || selection.start;
    const char = code[pos];
    
    const brackets: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      ')': '(',
      ']': '[',
      '}': '{'
    };
    
    const matchingChar = brackets[char];
    if (!matchingChar) return null;
    
    const isOpening = '([{'.includes(char);
    const direction = isOpening ? 1 : -1;
    const start = pos + direction;
    
    let count = 1;
    for (let i = start; i >= 0 && i < code.length; i += direction) {
      if (code[i] === char) {
        count++;
      } else if (code[i] === matchingChar) {
        count--;
        if (count === 0) {
          return i;
        }
      }
    }
    
    return null;
  }, [code, selection.start]);

  // Navegar a la llave/paréntesis correspondiente
  const goToMatchingBracket = useCallback(() => {
    const matchingPos = findMatchingBracket();
    if (matchingPos !== null) {
      onSelectionChange({ start: matchingPos, end: matchingPos });
      onCursorPositionChange(matchingPos);
      
      const newPosition = getLineAndColumn(matchingPos);
      addToNavigationHistory(newPosition);
      return true;
    }
    
    return false;
  }, [findMatchingBracket, onSelectionChange, onCursorPositionChange, getLineAndColumn, addToNavigationHistory]);

  // Navegar hacia atrás en el historial
  const navigateBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const position = navigationHistory[newIndex];
      
      if (position) {
        const pos = getPositionFromLineColumn(position.line, position.column);
        onSelectionChange({ start: pos, end: pos });
        onCursorPositionChange(pos);
        setHistoryIndex(newIndex);
        return true;
      }
    }
    
    return false;
  }, [historyIndex, navigationHistory, getPositionFromLineColumn, onSelectionChange, onCursorPositionChange]);

  // Navegar hacia adelante en el historial
  const navigateForward = useCallback(() => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const position = navigationHistory[newIndex];
      
      if (position) {
        const pos = getPositionFromLineColumn(position.line, position.column);
        onSelectionChange({ start: pos, end: pos });
        onCursorPositionChange(pos);
        setHistoryIndex(newIndex);
        return true;
      }
    }
    
    return false;
  }, [historyIndex, navigationHistory, getPositionFromLineColumn, onSelectionChange, onCursorPositionChange]);

  // Seleccionar línea completa
  const selectCurrentLine = useCallback(() => {
    const currentPos = getCurrentPosition();
    const lines = code.split('\n');
    
    const lineStart = getPositionFromLineColumn(currentPos.line, 0);
    const lineEnd = currentPos.line < lines.length - 1 
      ? getPositionFromLineColumn(currentPos.line + 1, 0) - 1
      : getPositionFromLineColumn(currentPos.line, lines[currentPos.line].length);
    
    onSelectionChange({ start: lineStart, end: lineEnd });
  }, [getCurrentPosition, code, getPositionFromLineColumn, onSelectionChange]);

  // Seleccionar palabra actual
  const selectCurrentWord = useCallback(() => {
    const currentPos = selection.start;
    let start = currentPos;
    let end = currentPos;
    
    // Encontrar inicio de palabra
    while (start > 0 && /\w/.test(code[start - 1])) {
      start--;
    }
    
    // Encontrar final de palabra
    while (end < code.length && /\w/.test(code[end])) {
      end++;
    }
    
    if (start !== end) {
      onSelectionChange({ start, end });
    }
  }, [selection.start, code, onSelectionChange]);

  // Obtener estadísticas del documento
  const getDocumentStats = useCallback(() => {
    const lines = code.split('\n');
    const currentPos = getCurrentPosition();
    
    return {
      totalLines: lines.length,
      totalCharacters: code.length,
      currentLine: currentPos.line + 1,
      currentColumn: currentPos.column + 1,
      selectedText: code.substring(selection.start, selection.end),
      hasSelection: selection.start !== selection.end,
    };
  }, [code, getCurrentPosition, selection]);

  return {
    // Navegación básica
    navigateLeft,
    navigateRight,
    
    // Navegación por palabras
    navigateWordLeft,
    navigateWordRight,
    
    // Navegación por líneas
    goToLine,
    goToLineStart,
    goToLineEnd,
    
    // Navegación por documento
    goToDocumentStart,
    goToDocumentEnd,
    
    // Búsqueda y navegación
    goToNextOccurrence,
    goToPreviousOccurrence,
    
    // Navegación por brackets
    findMatchingBracket,
    goToMatchingBracket,
    
    // Historial de navegación
    navigateBack,
    navigateForward,
    canNavigateBack: historyIndex > 0,
    canNavigateForward: historyIndex < navigationHistory.length - 1,
    
    // Selección
    selectCurrentLine,
    selectCurrentWord,
    
    // Utilidades
    getCurrentPosition,
    getLineAndColumn,
    getPositionFromLineColumn,
    getDocumentStats,
    
    // Estado del historial
    navigationHistory,
    historyIndex,
  };
};