import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Organisms
import { CodeEditor, CodeEditorRef } from '@/src/components/organisms/editor/CodeEditor';
import { ConsolePanel } from '@/src/components/organisms/editor/ConsolePanel';
import { EditorFooter } from '@/src/components/organisms/editor/EditorFooter';
import { EditorHeader } from '@/src/components/organisms/editor/EditorHeader';
import { SearchBar, SearchBarRef } from '@/src/components/organisms/editor/SearchBar';
import { Sidebar } from '@/src/components/organisms/sidebar/Sidebar';

// Hooks
import { useCodeHistory } from '@/src/hooks/editor/useCodeHistory';
import { useCodeSearch } from '@/src/hooks/editor/useCodeSearch';
import { useEditorFile } from '@/src/hooks/editor/useEditorFile';

// Utils
import { COLOR } from '@/src/constants/colors';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { CODE_TEMPLATES, getFileExtension } from '@/src/utils/editor/templates';

const Editor = () => {
  const params = useLocalSearchParams<{ language?: string }>();
  const urlLanguage = params.language;
  
  // Contexto del sidebar
  const { openSidebar, selectedFile } = useSidebarContext();
  
  // Función para normalizar nombres de lenguajes
  const normalizeLanguageName = (lang: string): string => {
    const normalized = lang.toLowerCase();
    switch (normalized) {
      case 'javascript':
      case 'js':
        return 'JavaScript';
      case 'python':
      case 'py':
        return 'Python';
      case 'java':
        return 'Java';
      case 'html':
      case 'htm':
        return 'Html';
      case 'css':
        return 'CSS';
      case 'mysql':
      case 'sql':
        return 'MySQL';
      case 'typescript':
      case 'ts':
        return 'TypeScript';
      default:
        return lang;
    }
  };

  // Función para detectar lenguaje basado en la extensión del archivo
  const detectLanguageFromFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'JavaScript';
      case 'py':
        return 'Python';
      case 'java':
        return 'Java';
      case 'html':
      case 'htm':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'sql':
        return 'MySQL';
      case 'ts':
      case 'tsx':
        return 'TypeScript';
      case 'cpp':
      case 'c':
        return 'C++';
      default:
        return 'Código';
    }
  };

  // Determinar el lenguaje a usar
  const detectedLanguage = urlLanguage || (selectedFile ? detectLanguageFromFile(selectedFile.name) : 'Código');
  const language = normalizeLanguageName(detectedLanguage);

  // Hook para manejar archivos
  const {
    content: fileContent,
    isLoading: isLoadingFile,
    isSaving: isSavingFile,
    hasUnsavedChanges,
    updateContent,
    saveFileContent
  } = useEditorFile(selectedFile);
  
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
  const searchBarRef = useRef<SearchBarRef>(null);
  
  // Referencia para controlar la inicialización
  const isInitialized = useRef(false);
  const lastLanguage = useRef<string>('');

  // Inicialización con template según el lenguaje
  useEffect(() => {
    const shouldInitialize = !isInitialized.current || (language !== lastLanguage.current && language !== 'Código');
    
    if (shouldInitialize) {
      // Si ya hay contenido del archivo, usarlo en lugar del template
      if (fileContent && fileContent.trim() !== '') {
        setCode(fileContent);
        if (selectedFile) {
          setFileName(selectedFile.name);
        }
        lastLanguage.current = language;
      } else if (language && CODE_TEMPLATES[language]) {
        const template = CODE_TEMPLATES[language];
        setCode(template);
        setFileName(`main${getFileExtension(language)}`);
        lastLanguage.current = language;
      } else if (language === 'Código') {
        // No hacer nada, esperar a que se seleccione un archivo o se pase un lenguaje válido
        return;
      } else {
        setCode(`// New File
// Start coding here...

console.log("Hello, World!");`);
        setFileName('untitled.txt');
        lastLanguage.current = language;
      }
      isInitialized.current = true;
    }
  }, [language, urlLanguage, selectedFile, detectedLanguage, fileContent]);

  // Efecto para sincronizar contenido del archivo con el estado del editor
  useEffect(() => {
    if (fileContent !== code && fileContent !== '') {
      setCode(fileContent);
    }
  }, [fileContent, code]);

  // Efecto para actualizar nombre del archivo
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      setFileName(selectedFile.name);
    }
  }, [selectedFile]);

  // Handlers principales
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    updateContent(newCode); // Actualizar contenido del archivo
    
    // Solo agregar al historial si no es una operación de undo/redo
    codeHistory.addToHistory(newCode);
    
    // Reset del flag después de actualizar el código
    setTimeout(() => {
      codeHistory.resetUndoRedoFlag();
    }, 0);
    
    if (codeSearch.showSearch && codeSearch.searchText) {
      codeSearch.updateSearchMatches(newCode, codeSearch.searchText);
    }
  }, [codeHistory, codeSearch, updateContent]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await saveFileContent();
      if (success) {
        console.log('Archivo guardado exitosamente:', fileName);
      } else {
        console.error('Error al guardar el archivo');
      }
    } finally {
      setIsSaving(false);
    }
  }, [saveFileContent, fileName]);

  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    
    if (!showConsole) setShowConsole(true);
    setIsRunning(true);
    
    try {
      // La ejecución se maneja en ConsolePanel
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRunning(false);
    }
  }, [code, showConsole]);

  // Handlers de navegación
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

  // Handler de formateo de código
  const handleFormatCode = useCallback(() => {
    try {
      const lines = code.split('\n');
      let indentLevel = 0;
      
      const formattedLines = lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Líneas vacías se mantienen vacías
        if (trimmed === '') return '';
        
        // Calcular nivel de indentación para esta línea
        let currentIndent = indentLevel;
        
        // Si la línea empieza con }, ), ], reducir indentación
        if (/^[}\]\)]/.test(trimmed)) {
          currentIndent = Math.max(0, indentLevel - 1);
        }
        
        // Aplicar indentación
        const indentedLine = '  '.repeat(currentIndent) + trimmed;
        
        // Actualizar nivel de indentación para la siguiente línea
        const openBraces = (trimmed.match(/[{[\(]/g) || []).length;
        const closeBraces = (trimmed.match(/[}]\)]/g) || []).length;
        indentLevel += openBraces - closeBraces;
        indentLevel = Math.max(0, indentLevel);
        
        return indentedLine;
      });
      
      const formatted = formattedLines.join('\n');
      
      // Solo actualizar si hay cambios
      if (formatted !== code) {
        setCode(formatted);
        codeHistory.addToHistory(formatted, true); // Forzar agregado al historial
        updateContent(formatted);
        
        // Actualizar búsqueda si está activa
        if (codeSearch.showSearch && codeSearch.searchText) {
          codeSearch.updateSearchMatches(formatted, codeSearch.searchText);
        }
      }
    } catch (error) {
      console.error('Error al formatear código:', error);
    }
  }, [code, codeHistory, codeSearch, updateContent]);

  // Handler para duplicar línea
  const handleDuplicateLine = useCallback(() => {
    const lines = code.split('\n');
    const currentLineIndex = code.substring(0, cursorPosition).split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    lines.splice(currentLineIndex + 1, 0, currentLine);
    const newCode = lines.join('\n');
    setCode(newCode);
    codeHistory.addToHistory(newCode, true); // Forzar agregado al historial
    updateContent(newCode);
    
    // Actualizar búsqueda si está activa
    if (codeSearch.showSearch && codeSearch.searchText) {
      codeSearch.updateSearchMatches(newCode, codeSearch.searchText);
    }
  }, [code, cursorPosition, codeHistory, codeSearch, updateContent]);

  // Handler para comentar/descomentar
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
    codeHistory.addToHistory(newCode, true); // Forzar agregado al historial
    updateContent(newCode);
    
    // Actualizar búsqueda si está activa
    if (codeSearch.showSearch && codeSearch.searchText) {
      codeSearch.updateSearchMatches(newCode, codeSearch.searchText);
    }
  }, [code, cursorPosition, codeHistory, codeSearch, updateContent]);

  // Handlers de búsqueda
  const handleNavigateToMatch = useCallback((selection: { start: number; end: number }) => {
    setSelection(selection);
    setCursorPosition(selection.start);
    if (codeEditorRef.current) {
      // Función de callback para devolver el foco al SearchInput
      const returnFocusToSearch = () => {
        if (searchBarRef.current) {
          searchBarRef.current.focusSearchInput();
        }
      };
      codeEditorRef.current.selectWithoutFocus(selection, returnFocusToSearch);
    }
  }, []);

  const handleNavigateToMatchWithFocus = useCallback((selection: { start: number; end: number }) => {
    setSelection(selection);
    setCursorPosition(selection.start);
    if (codeEditorRef.current) {
      codeEditorRef.current.focusAndSelect(selection);
    }
  }, []);

  // Handler del menú (abre el sidebar)
  const handleMenuPress = useCallback(() => {
    openSidebar();
  }, [openSidebar]);

  return (
    <Sidebar>
      <SafeAreaView style={styles.container}>
        <EditorHeader
          fileName={fileName}
          isSaving={isSaving || isSavingFile}
          isRunning={isRunning}
          showConsole={showConsole}
          onMenuPress={handleMenuPress}
          onSavePress={handleSave}
          onSearchPress={codeSearch.toggleSearch}
          onConsoleToggle={() => setShowConsole(!showConsole)}
          onRunPress={handleRun}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {isLoadingFile && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando archivo...</Text>
          </View>
        )}

        {codeSearch.showSearch && (
          <SearchBar
            ref={searchBarRef}
            searchText={codeSearch.searchText}
            searchMatches={codeSearch.searchMatches}
            currentMatchIndex={codeSearch.currentMatchIndex}
            onSearchTextChange={codeSearch.setSearchText}
            onSearchNext={codeSearch.searchNext}
            onSearchPrevious={codeSearch.searchPrevious}
            onUpdateMatches={codeSearch.updateSearchMatches}
            onNavigateToMatch={handleNavigateToMatch}
            onNavigateToMatchWithFocus={handleNavigateToMatchWithFocus}
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
            if (undoCode !== null) {
              setCode(undoCode);
              updateContent(undoCode);
              // Actualizar búsqueda si está activa
              if (codeSearch.showSearch && codeSearch.searchText) {
                codeSearch.updateSearchMatches(undoCode, codeSearch.searchText);
              }
            }
          }}
          onRedo={() => {
            const redoCode = codeHistory.redo();
            if (redoCode !== null) {
              setCode(redoCode);
              updateContent(redoCode);
              // Actualizar búsqueda si está activa
              if (codeSearch.showSearch && codeSearch.searchText) {
                codeSearch.updateSearchMatches(redoCode, codeSearch.searchText);
              }
            }
          }}
          onNavigateLeft={handleNavigateLeft}
          onNavigateRight={handleNavigateRight}
          onMoreMenuToggle={() => setShowMoreMenu(!showMoreMenu)}
          onFormatCode={handleFormatCode}
          onDuplicateLine={handleDuplicateLine}
          onToggleComment={handleToggleComment}
        />
      </SafeAreaView>
    </Sidebar>
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLOR.surface,
  },
  loadingText: {
    color: COLOR.textSecondary,
    fontSize: 14,
  },
});

export default Editor;