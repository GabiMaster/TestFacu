import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

  useEffect(() => {
    if (language && CODE_TEMPLATES[language]) {
      setCode(CODE_TEMPLATES[language]);
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
      setFileName('untitled.txt');
    }
  }, [language]);

  const handleRunCode = () => {
    // Función para ejecutar el código
    console.log('Ejecutando código:', code);
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchText('');
    }
  };

  const handleMenuOptions = () => {
    // Función para mostrar opciones del menú
    console.log('Mostrando opciones del menú');
  };

  // En la función handleFormatCode:
  const handleFormatCode = () => {
    if (!code.trim()) return;
    
    const formattedCode = basicFormat(code);
    setCode(formattedCode);
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
        
        // Casos especiales para reducir indentación
        if (trimmed === '}' || trimmed.startsWith('} ') || trimmed === '});') {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indent = ' '.repeat(indentLevel * indentSize);
        
        // Casos para aumentar indentación
        if (trimmed.endsWith('{') || 
            (trimmed.includes('if(') && trimmed.endsWith('{'))) {
          indentLevel++;
        }
        
        // Agregar espacios alrededor de operadores
        const formatted = trimmed
          .replace(/=/g, ' = ')
          .replace(/\+/g, ' + ')
          .replace(/\s+/g, ' ') // Eliminar espacios múltiples
          .replace(/\(\s+/g, '(') // Quitar espacio después de (
          .replace(/\s+\)/g, ')'); // Quitar espacio antes de )
        
        return indent + formatted;
      })
      .join('\n');
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
          <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
            <Icon name="magnify" size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.runButton} onPress={handleRunCode}>
            <Icon name="play" size={moderateScale(20)} color={COLOR.textPrimary} />
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
              onChangeText={setSearchText}
              placeholder="Buscar en el código..."
              placeholderTextColor={COLOR.textSecondary}
              autoFocus
            />
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchActions}>
            <TouchableOpacity style={styles.searchActionButton}>
              <Icon name="chevron-up" size={moderateScale(16)} color={COLOR.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchActionButton}>
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
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
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

      {/* Footer - TabBar del editor */}
      <View style={styles.footer}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabButton}>
            <Icon name="content-save" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Guardar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabButton}>
            <Icon name="undo" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Deshacer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabButton}>
            <Icon name="redo" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Rehacer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabButton} onPress={handleFormatCode}>
            <Icon name="format-text" size={moderateScale(20)} color={COLOR.icon} />
            <Text style={styles.tabButtonText}>Formato</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabButton}>
            <Icon name="chevron-left" size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabButton}>
            <Icon name="chevron-right" size={moderateScale(20)} color={COLOR.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Editor;

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
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    gap: scale(6),
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
    gap: scale(4),
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
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    paddingBottom: verticalScale(16),
    gap: scale(4),
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    minWidth: moderateScale(44),
    gap: verticalScale(2),
  },
  tabButtonText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
});