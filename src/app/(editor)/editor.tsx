import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const CODE_TEMPLATES: Record<string, string> = {
  Python: `print("Hola Mundo")`,
  Java: `public class HolaMundo {
    public static void main (String[] args) {
        System.out.println("Hola Mundo");
    }
}`,
  JavaScript: `console.log("Hola Mundo");`,
  Html: `<!DOCTYPE html>
<html>
  <head>
    <title>Hola Mundo</title>
  </head>
  <body>
    <h1>Hola Mundo</h1>
  </body>
</html>`,
  MySQL: `SELECT 'Hola Mundo';`,
};

const Editor = () => {
  const params = useLocalSearchParams<{ language?: string }>();
  const language = params.language;
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('game.js');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  
  const textInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (language && CODE_TEMPLATES[language]) {
      const template = CODE_TEMPLATES[language];
      setCode(template);
      setHistory([template]);
      setHistoryIndex(0);
      
      // Generar nombre de archivo basado en el lenguaje
      const extensions: Record<string, string> = {
        Python: '.py',
        Java: '.java',
        JavaScript: '.js',
        Html: '.html',
        MySQL: '.sql'
      };
      setFileName(`main${extensions[language] || '.txt'}`);
    } else {
      setCode('');
      setHistory(['']);
      setHistoryIndex(0);
      setFileName('untitled.txt');
    }
  }, [language]);

  // Animación del menú "Más"
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showMoreMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMoreMenu, slideAnim]);

  // Función para agregar al historial
  const addToHistory = (newCode: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Función para manejar cambios en el código
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Agregar al historial solo si es diferente del último
    if (history[historyIndex] !== newCode) {
      addToHistory(newCode);
    }
    // Actualizar búsqueda si está activa
    if (showSearch && searchText) {
      updateSearchMatches(newCode, searchText);
    }
  };

  // Función para actualizar la selección
  const handleSelectionChange = (event: any) => {
    const { start, end } = event.nativeEvent.selection;
    setSelection({ start, end });
    setCursorPosition(start);
  };

  // Función para actualizar coincidencias de búsqueda
  const updateSearchMatches = (text: string, search: string) => {
    if (!search.trim()) {
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      return;
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
  };

  // Función para ejecutar el código
  const handleRunCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'No hay código para ejecutar');
      return;
    }

    setIsRunning(true);
    try {
      // Simular ejecución del código
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Éxito', `Código ${language || 'genérico'} ejecutado correctamente`);
      console.log('Ejecutando código:', code);
    } catch (error) {
      Alert.alert('Error', 'Error al ejecutar el código');
      console.error('Error ejecutando código:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Función para guardar el código
  const handleSaveCode = async () => {
    setIsSaving(true);
    try {
      // Simular guardado del código
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Éxito', `Archivo ${fileName} guardado correctamente`);
      console.log('Guardando código:', { fileName, code });
    } catch (error) {
      Alert.alert('Error', 'Error al guardar el archivo');
      console.error('Error guardando código:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para buscar texto
  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchText('');
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
    }
  };

  // Función para manejar cambios en el texto de búsqueda
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    updateSearchMatches(code, text);
  };

  // Función para buscar siguiente
  const handleSearchNext = () => {
    if (searchMatches.length === 0) {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
      return;
    }

    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    const position = searchMatches[nextIndex];
    setCursorPosition(position);
    setSelection({ start: position, end: position + searchText.length });
    
    // Enfocar el TextInput y actualizar la selección
    textInputRef.current?.focus();
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: position, end: position + searchText.length }
      });
    }, 100);
  };

  // Función para buscar anterior
  const handleSearchPrevious = () => {
    if (searchMatches.length === 0) {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
      return;
    }

    const prevIndex = currentMatchIndex - 1 < 0 ? searchMatches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    const position = searchMatches[prevIndex];
    setCursorPosition(position);
    setSelection({ start: position, end: position + searchText.length });
    
    // Enfocar el TextInput y actualizar la selección
    textInputRef.current?.focus();
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: position, end: position + searchText.length }
      });
    }, 100);
  };

  // Función para deshacer
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  // Función para rehacer
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  // Función auxiliar para actualizar la posición del cursor
  const updateCursorPosition = (position: number) => {
    setCursorPosition(position);
    setSelection({ start: position, end: position });
    
    // Forzar la actualización de la selección
    if (textInputRef.current) {
      textInputRef.current.focus();
      setTimeout(() => {
        textInputRef.current?.setNativeProps({
          selection: { start: position, end: position }
        });
      }, 50); // Pequeño retraso para asegurar que el componente esté listo
    }
  };

  // Función para navegar hacia la izquierda (carácter anterior)
  const handleNavigateLeft = () => {
    const newPosition = Math.max(0, cursorPosition - 1);
    updateCursorPosition(newPosition);
  };

  // Función para navegar hacia la derecha (carácter siguiente)
  const handleNavigateRight = () => {
    const newPosition = Math.min(code.length, cursorPosition + 1);
    updateCursorPosition(newPosition);
  };

  // Función auxiliar para obtener línea y columna actual
  const getCurrentLineAndColumn = (position: number) => {
    const lines = code.split('\n');
    let currentPos = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length;
      const lineEnd = currentPos + lineLength;
      
      // Si la posición está dentro de esta línea
      if (position >= currentPos && position <= lineEnd) {
        return {
          lineIndex: i,
          column: position - currentPos,
          lineStart: currentPos,
        };
      }
      
      // Mover al inicio de la siguiente línea (+1 por el \n)
      currentPos = lineEnd + 1;
    }

    // Si llegamos aquí, la posición está al final del código
    return {
      lineIndex: lines.length - 1,
      column: lines[lines.length - 1].length,
      lineStart: currentPos - lines[lines.length - 1].length - 1,
    };
  };

  // Función para navegar líneas hacia arriba
  const handleNavigateUp = () => {
    const lines = code.split('\n');
    const { lineIndex, column } = getCurrentLineAndColumn(cursorPosition);

    // Solo moverse si no estamos en la primera línea
    if (lineIndex > 0) {
      const prevLine = lines[lineIndex - 1];
      
      // Calcular la posición del inicio de la línea anterior
      let prevLineStart = 0;
      for (let i = 0; i < lineIndex - 1; i++) {
        prevLineStart += lines[i].length + 1; // +1 por el \n
      }
      
      // Mantener la columna si es posible, sino ir al final de la línea anterior
      const newColumn = Math.min(column, prevLine.length);
      const newPosition = prevLineStart + newColumn;
      
      updateCursorPosition(newPosition);
    }
    setShowMoreMenu(false);
  };

  // Función para navegar líneas hacia abajo
  const handleNavigateDown = () => {
    const lines = code.split('\n');
    const { lineIndex, column } = getCurrentLineAndColumn(cursorPosition);

    // Solo moverse si no estamos en la última línea
    if (lineIndex < lines.length - 1) {
      const nextLine = lines[lineIndex + 1];
      
      // Calcular la posición del inicio de la línea siguiente
      let nextLineStart = 0;
      for (let i = 0; i <= lineIndex; i++) {
        nextLineStart += lines[i].length + 1; // +1 por el \n
      }
      
      // Mantener la columna si es posible, sino ir al final de la línea siguiente
      const newColumn = Math.min(column, nextLine.length);
      const newPosition = nextLineStart + newColumn;
      
      updateCursorPosition(newPosition);
    }
    setShowMoreMenu(false);
  };

  // Función para formatear código
  const handleFormatCode = () => {
    if (!code.trim()) return;
    
    const formattedCode = basicFormat(code);
    setCode(formattedCode);
    addToHistory(formattedCode);
    setShowMoreMenu(false);
  };

  // Función para duplicar línea
  const handleDuplicateLine = () => {
    const lines = code.split('\n');
    const currentLineIndex = code.slice(0, selection.start).split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    lines.splice(currentLineIndex + 1, 0, currentLine);
    const newCode = lines.join('\n');
    setCode(newCode);
    addToHistory(newCode);
    setShowMoreMenu(false);
  };

  // Función para comentar/descomentar línea
  const handleToggleComment = () => {
    const lines = code.split('\n');
    const currentLineIndex = code.slice(0, selection.start).split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    const commentSymbols: Record<string, string> = {
      Python: '#',
      Java: '//',
      JavaScript: '//',
      Html: '<!--',
      MySQL: '--'
    };
    
    const commentSymbol = commentSymbols[language || 'JavaScript'] || '//';
    
    if (currentLine.trim().startsWith(commentSymbol)) {
      // Descomentar
      lines[currentLineIndex] = currentLine.replace(new RegExp(`^\\s*${commentSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s?`), '');
    } else {
      // Comentar
      lines[currentLineIndex] = commentSymbol + ' ' + currentLine;
    }
    
    const newCode = lines.join('\n');
    setCode(newCode);
    addToHistory(newCode);
    setShowMoreMenu(false);
  };

  // Función básica de formateo
  const basicFormat = (code: string) => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentSize = 2;
    
    return lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // Reducir indentación antes de procesar líneas que terminan bloques
        if (trimmed === '}' || trimmed.startsWith('} ') || trimmed === '});') {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indent = ' '.repeat(indentLevel * indentSize);
        
        // Aumentar indentación después de procesar líneas que abren bloques
        if (trimmed.endsWith('{') || 
            (trimmed.includes('if(') && trimmed.endsWith('{'))) {
          indentLevel++;
        }
        
        return indent + trimmed;
      })
      .join('\n');
  };

  // Función para mostrar opciones del menú
  const handleMenuOptions = () => {
    Alert.alert(
      'Opciones del Editor',
      'Selecciona una opción:',
      [
        { text: 'Nuevo archivo', onPress: () => console.log('Nuevo archivo') },
        { text: 'Configuración', onPress: () => console.log('Configuración') },
        { text: 'Ayuda', onPress: () => console.log('Ayuda') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  // Función para mostrar/ocultar menú "Más"
  const handleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuOptions}>
            <Icon name="menu" size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
          <Text style={styles.fileName}>{fileName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, isSaving && styles.buttonDisabled]} 
            onPress={handleSaveCode}
            disabled={isSaving}
          >
            <Icon name={isSaving ? "loading" : "content-save"} size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
            <Icon name="magnify" size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.runButton, isRunning && styles.buttonDisabled]} 
            onPress={handleRunCode}
            disabled={isRunning}
          >
            <Icon name={isRunning ? "loading" : "play"} size={moderateScale(20)} color={COLOR.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar (si está activo) */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={moderateScale(18)} color={COLOR.icon} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearchTextChange}
              placeholder="Buscar en el código..."
              placeholderTextColor={COLOR.textSecondary}
              autoFocus
            />
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchActions}>
            <Text style={styles.searchCounter}>
              {searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0'}
            </Text>
            <TouchableOpacity style={styles.searchActionButton} onPress={handleSearchPrevious}>
              <Icon name="chevron-up" size={moderateScale(16)} color={COLOR.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchActionButton} onPress={handleSearchNext}>
              <Icon name="chevron-down" size={moderateScale(16)} color={COLOR.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Body - Editor de código */}
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={verticalScale(10)}
      >
        <ScrollView
          style={styles.codeContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.codeEditor}>
            <View style={styles.lineNumbers}>
              {code.split('\n').map((_, index) => (
                <Text key={index} style={styles.lineNumber}>
                  {index + 1}
                </Text>
              ))}
            </View>
            <TextInput
              ref={textInputRef}
              style={styles.codeInput}
              value={code}
              onChangeText={handleCodeChange}
              selection={{ start: cursorPosition, end: cursorPosition }}
              onSelectionChange={({ nativeEvent: { selection } }) => {
                updateCursorPosition(selection.start);
              }}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textAlignVertical="top"
              placeholder="Escribe tu código aquí..."
              placeholderTextColor={COLOR.textSecondary}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer - TabBar del editor con menú expandible */}
      <View style={styles.footer}>
        {/* Menú "Más" expandible */}
        {showMoreMenu && (
          <Animated.View 
            style={[
              styles.moreMenuContainer,
              {
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }],
                opacity: slideAnim
              }
            ]}
          >
            <View style={styles.moreMenu}>
              <TouchableOpacity style={styles.moreMenuItem} onPress={handleFormatCode}>
                <Icon name="code-tags" size={moderateScale(20)} color={COLOR.icon} />
                <Text style={styles.moreMenuText}>Formatear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreMenuItem} onPress={handleNavigateUp}>
                <Icon name="chevron-up" size={moderateScale(20)} color={COLOR.icon} />
                <Text style={styles.moreMenuText}>Arriba</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreMenuItem} onPress={handleNavigateDown}>
                <Icon name="chevron-down" size={moderateScale(20)} color={COLOR.icon} />
                <Text style={styles.moreMenuText}>Abajo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreMenuItem} onPress={handleDuplicateLine}>
                <Icon name="content-duplicate" size={moderateScale(20)} color={COLOR.icon} />
                <Text style={styles.moreMenuText}>Duplicar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreMenuItem} onPress={handleToggleComment}>
                <Icon name="comment-outline" size={moderateScale(20)} color={COLOR.icon} />
                <Text style={styles.moreMenuText}>Comentar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* TabBar principal */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabButton, historyIndex <= 0 && styles.tabButtonDisabled]} 
            onPress={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Icon name="undo" size={moderateScale(20)} color={historyIndex <= 0 ? COLOR.textSecondary : COLOR.icon} />
            <Text style={[styles.tabButtonText, historyIndex <= 0 && styles.tabButtonTextDisabled]}>Deshacer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, historyIndex >= history.length - 1 && styles.tabButtonDisabled]} 
            onPress={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Icon name="redo" size={moderateScale(20)} color={historyIndex >= history.length - 1 ? COLOR.textSecondary : COLOR.icon} />
            <Text style={[styles.tabButtonText, historyIndex >= history.length - 1 && styles.tabButtonTextDisabled]}>Rehacer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={handleNavigateLeft}>
            <Icon name="chevron-left" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Izquierda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={handleNavigateRight}>
            <Icon name="chevron-right" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Derecha</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, showMoreMenu && styles.tabButtonActive]} 
            onPress={handleMoreMenu}
          >
            <Icon name="dots-horizontal" size={moderateScale(20)} color={showMoreMenu ? COLOR.primary : COLOR.icon} />
            <Text style={[styles.tabButtonText, showMoreMenu && styles.tabButtonTextActive]}>Más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    paddingTop: verticalScale(36),
    backgroundColor: COLOR.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  menuButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(6),
    backgroundColor: COLOR.surfaceLight,
  },
  fileName: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: scale(12),
    flex: 1,
  },
  headerButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(6),
    backgroundColor: COLOR.surfaceLight,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    gap: scale(4),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchContainer: {
    backgroundColor: COLOR.surface,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surfaceLight,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    paddingVertical: 0,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  searchCounter: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    minWidth: moderateScale(35),
    textAlign: 'center',
  },
  searchActionButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: COLOR.surfaceLight,
  },
  body: {
    flex: 1,
  },
  codeContainer: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  codeEditor: {
    flexDirection: 'row',
    flex: 1,
  },
  lineNumbers: {
    backgroundColor: COLOR.surfaceLight,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(12),
    borderRightWidth: 1,
    borderRightColor: COLOR.border,
    minWidth: moderateScale(40),
  },
  lineNumber: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    lineHeight: moderateScale(18),
    textAlign: 'right',
  },
  codeInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    lineHeight: moderateScale(18),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
    textAlignVertical: 'top',
    minHeight: '100%',
  },
  footer: {
    backgroundColor: COLOR.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moreMenuContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLOR.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  moreMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(8),
  },
  moreMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    minWidth: moderateScale(48),
    gap: verticalScale(2),
  },
  moreMenuText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(6),
    paddingBottom: verticalScale(12),
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    minWidth: moderateScale(48),
    gap: verticalScale(2),
  },
  tabButtonActive: {
    backgroundColor: COLOR.surfaceLight,
  },
  tabButtonText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: COLOR.primary,
  },
  tabButtonDisabled: {
    opacity: 0.4,
  },
  tabButtonTextDisabled: {
    color: COLOR.textSecondary,
  },
});

export default Editor;