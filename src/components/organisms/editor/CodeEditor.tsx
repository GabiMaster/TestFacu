import { COLOR } from '@/src/constants/colors';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CodeEditorProps {
  code: string;
  selection: { start: number; end: number };
  onCodeChange: (code: string) => void;
  onSelectionChange: (selection: { start: number; end: number }) => void;
  onCursorPositionChange: (position: number) => void;
  showConsole: boolean;
}

export interface CodeEditorRef {
  focusAndSelect: (selection: { start: number; end: number }) => void;
  selectWithoutFocus: (selection: { start: number; end: number }, returnFocusCallback?: () => void) => void;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  code,
  selection,
  onCodeChange,
  onSelectionChange,
  onCursorPositionChange,
  showConsole,
}, ref) => {
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focusAndSelect: (newSelection: { start: number; end: number }) => {
      if (textInputRef.current) {
        textInputRef.current.focus();
        // Pequeño delay para asegurar que el TextInput está enfocado
        setTimeout(() => {
          if (textInputRef.current) {
            textInputRef.current.setNativeProps({
              selection: newSelection,
            });
            onSelectionChange(newSelection);
            onCursorPositionChange(newSelection.start);
          }
        }, 50);
      }
    },
    selectWithoutFocus: (newSelection: { start: number; end: number }, returnFocusCallback?: () => void) => {
      if (textInputRef.current) {
        // Enfocamos brevemente para mostrar la selección
        textInputRef.current.focus();
        
        setTimeout(() => {
          if (textInputRef.current) {
            textInputRef.current.setNativeProps({
              selection: newSelection,
            });
            onSelectionChange(newSelection);
            onCursorPositionChange(newSelection.start);
            
            // Si hay un callback, lo ejecutamos después de un breve delay
            if (returnFocusCallback) {
              setTimeout(() => {
                returnFocusCallback();
              }, 100);
            }
          }
        }, 50);
      }
    },
  }));

  const handleSelectionChange = ({ nativeEvent: { selection: newSelection } }: any) => {
    onCursorPositionChange(newSelection.start);
    onSelectionChange({ start: newSelection.start, end: newSelection.end });
  };

  // Función para obtener el número de líneas basado en el código
  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => index + 1);
  };

  return (
    <View style={[styles.editorSection, showConsole && styles.editorWithConsole]}>
      <ScrollView
        style={styles.codeContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
      >
        <View style={styles.codeEditor}>
          {/* Números de línea */}
          <View style={styles.lineNumbers}>
            {getLineNumbers().map((lineNumber) => (
              <Text key={lineNumber} style={styles.lineNumber}>
                {lineNumber}
              </Text>
            ))}
          </View>
          
          {/* Editor de texto */}
          <TextInput
            ref={textInputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={onCodeChange}
            selection={selection}
            onSelectionChange={handleSelectionChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            placeholder="Escribe tu código aquí..."
            placeholderTextColor={COLOR.textSecondary}
            scrollEnabled={false}
            blurOnSubmit={false}
            returnKeyType="default"
          />
        </View>
      </ScrollView>
    </View>
  );
});

CodeEditor.displayName = 'CodeEditor';

const styles = StyleSheet.create({
  editorSection: {
    flex: 1,
  },
  editorWithConsole: {
    flex: 0.6, // 60% cuando la consola está visible
  },
  codeContainer: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  codeEditor: {
    flexDirection: 'row',
    flex: 1,
    minHeight: '100%',
  },
  lineNumbers: {
    backgroundColor: COLOR.surfaceLight,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(12),
    borderRightWidth: 1,
    borderRightColor: COLOR.border,
    minWidth: moderateScale(50),
    alignItems: 'flex-end',
  },
  lineNumber: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontFamily: Platform.select({ 
      ios: 'Menlo', 
      android: 'RobotoMono-Regular',
      default: 'monospace' 
    }),
    lineHeight: moderateScale(18),
    textAlign: 'right',
  },
  codeInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontFamily: Platform.select({ 
      ios: 'Menlo', 
      android: 'RobotoMono-Regular',
      default: 'monospace' 
    }),
    lineHeight: moderateScale(18),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
    textAlignVertical: 'top',
    minHeight: '100%',
  },
});