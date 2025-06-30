import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';

// Organisms
import { CodeEditor, CodeEditorRef } from '@/src/components/organisms/editor/CodeEditor';
import { ConsolePanel } from '@/src/components/organisms/editor/ConsolePanel';
import { EditorFooter } from '@/src/components/organisms/editor/EditorFooter';
import { EditorHeader } from '@/src/components/organisms/editor/EditorHeader';
import { SearchBar } from '@/src/components/organisms/editor/SearchBar';

// Hooks
import { useCodeHistory } from '@/src/hooks/editor/useCodeHistory';
import { useCodeSearch } from '@/src/hooks/editor/useCodeSearch';

// Utils
import { COLOR } from '@/src/constants/colors';
import { CODE_TEMPLATES, getFileExtension } from '@/src/utils/editor/templates';

const Editor = () => {
  const params = useLocalSearchParams<{ language?: string }>();
  const language = params.language;
  
  // Estados principales
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Hooks personalizados
  const codeHistory = useCodeHistory(code);
  const codeSearch = useCodeSearch();
  
  // Referencias
  const codeEditorRef = useRef<CodeEditorRef>(null);
  
  // Referencia para evitar bucles infinitos
  const isInitialized = useRef(false);

  // Inicialización
  useEffect(() => {
    if (!isInitialized.current && language && CODE_TEMPLATES[language]) {
      const template = CODE_TEMPLATES[language];
      setCode(template);
      setFileName(`main${getFileExtension(language)}`);
      isInitialized.current = true;
    } else if (!isInitialized.current && !language) {
      setCode('');
      setFileName('untitled.txt');
      isInitialized.current = true;
    }
  }, [language]); // Removemos codeHistory de las dependencias

  // Handlers
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (codeHistory.history[codeHistory.historyIndex] !== newCode) {
      codeHistory.addToHistory(newCode);
    }
    if (codeSearch.showSearch && codeSearch.searchText) {
      codeSearch.updateSearchMatches(newCode, codeSearch.searchText);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Guardando:', { fileName, code });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    
    if (!showConsole) setShowConsole(true);
    setIsRunning(true);
    
    try {
      // La ejecución se maneja en ConsolePanel
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRunning(false);
    }
  };

  // Handlers adicionales para navegación y edición
  const handleNavigateLeft = useCallback(() => {
    if (cursorPosition > 0) {
      const newPosition = cursorPosition - 1;
      setCursorPosition(newPosition);
      setSelection({ start: newPosition, end: newPosition });
    }
  }, [cursorPosition]);

  const handleNavigateRight = useCallback(() => {
    if (cursorPosition < code.length) {
      const newPosition = cursorPosition + 1;
      setCursorPosition(newPosition);
      setSelection({ start: newPosition, end: newPosition });
    }
  }, [cursorPosition, code.length]);

  const handleFormatCode = useCallback(() => {
    // Implementación básica de formateo
    const formatted = code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    setCode(formatted);
    codeHistory.addToHistory(formatted);
  }, [code, codeHistory]);

  const handleDuplicateLine = useCallback(() => {
    const lines = code.split('\n');
    const currentLineIndex = code.substring(0, cursorPosition).split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    lines.splice(currentLineIndex + 1, 0, currentLine);
    const newCode = lines.join('\n');
    setCode(newCode);
    codeHistory.addToHistory(newCode);
  }, [code, cursorPosition, codeHistory]);

  const handleToggleComment = useCallback(() => {
    const lines = code.split('\n');
    const currentLineIndex = code.substring(0, cursorPosition).split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    if (currentLine.trim().startsWith('//')) {
      lines[currentLineIndex] = currentLine.replace(/^(\s*)\/\/\s?/, '$1');
    } else {
      lines[currentLineIndex] = currentLine.replace(/^(\s*)/, '$1// ');
    }
    
    const newCode = lines.join('\n');
    setCode(newCode);
    codeHistory.addToHistory(newCode);
  }, [code, cursorPosition, codeHistory]);

  // Handler para navegar a las coincidencias de búsqueda
  const handleNavigateToMatch = useCallback((selection: { start: number; end: number }) => {
    setSelection(selection);
    setCursorPosition(selection.start);
    if (codeEditorRef.current) {
      codeEditorRef.current.focusAndSelect(selection);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader
        fileName={fileName}
        isSaving={isSaving}
        isRunning={isRunning}
        showConsole={showConsole}
        onMenuPress={() => {}}
        onSavePress={handleSave}
        onSearchPress={codeSearch.toggleSearch}
        onConsoleToggle={() => setShowConsole(!showConsole)}
        onRunPress={handleRun}
      />

      {codeSearch.showSearch && (
        <SearchBar
          searchText={codeSearch.searchText}
          searchMatches={codeSearch.searchMatches}
          currentMatchIndex={codeSearch.currentMatchIndex}
          onSearchTextChange={codeSearch.setSearchText}
          onSearchNext={codeSearch.searchNext}
          onSearchPrevious={codeSearch.searchPrevious}
          onUpdateMatches={codeSearch.updateSearchMatches}
          onNavigateToMatch={handleNavigateToMatch}
          code={code}
        />
      )}

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.mainContent}>
          <CodeEditor
            ref={codeEditorRef}
            code={code}
            selection={selection}
            onCodeChange={handleCodeChange}
            onSelectionChange={setSelection}
            onCursorPositionChange={setCursorPosition}
            showConsole={showConsole}
          />

          {showConsole && (
            <ConsolePanel
              language={language}
              code={isRunning ? code : ''}
              isExecuting={isRunning}
              onToggle={() => setShowConsole(false)}
              onClear={() => {}}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <EditorFooter
        canUndo={codeHistory.canUndo}
        canRedo={codeHistory.canRedo}
        showMoreMenu={showMoreMenu}
        cursorPosition={cursorPosition}
        code={code}
        selection={selection}
        onUndo={() => {
          const undoCode = codeHistory.undo();
          if (undoCode) setCode(undoCode);
        }}
        onRedo={() => {
          const redoCode = codeHistory.redo();
          if (redoCode) setCode(redoCode);
        }}
        onNavigateLeft={handleNavigateLeft}
        onNavigateRight={handleNavigateRight}
        onMoreMenuToggle={() => setShowMoreMenu(!showMoreMenu)}
        onFormatCode={handleFormatCode}
        onDuplicateLine={handleDuplicateLine}
        onToggleComment={handleToggleComment}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  body: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default Editor;