import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { NavigationMenu } from './NavigationMenu';

interface EditorFooterProps {
  canUndo: boolean;
  canRedo: boolean;
  showMoreMenu: boolean;
  cursorPosition: number;
  code: string;
  selection: { start: number; end: number };
  onUndo: () => void;
  onRedo: () => void;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
  onMoreMenuToggle: () => void;
  onFormatCode: () => void;
  onDuplicateLine: () => void;
  onToggleComment: () => void;
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
  canUndo,
  canRedo,
  showMoreMenu,
  cursorPosition,
  code,
  selection,
  onUndo,
  onRedo,
  onNavigateLeft,
  onNavigateRight,
  onMoreMenuToggle,
  onFormatCode,
  onDuplicateLine,
  onToggleComment,
}) => {
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animación del menú "Más"
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showMoreMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMoreMenu, slideAnim]);

  // Función para navegar líneas hacia arriba
  const handleNavigateUp = () => {
    const lines = code.split('\n');
    const { lineIndex, column } = getCurrentLineAndColumn(selection.start);

    if (lineIndex > 0) {
      const prevLine = lines[lineIndex - 1];
      
      let prevLineStart = 0;
      for (let i = 0; i < lineIndex - 1; i++) {
        prevLineStart += lines[i].length + 1;
      }
      
      const newColumn = Math.min(column, prevLine.length);
      const newPosition = prevLineStart + newColumn;
      
      // Aquí deberías llamar a una función que actualice la posición del cursor
      // onNavigateUp(newPosition);
    }
  };

  // Función para navegar líneas hacia abajo
  const handleNavigateDown = () => {
    const lines = code.split('\n');
    const { lineIndex, column } = getCurrentLineAndColumn(selection.start);

    if (lineIndex < lines.length - 1) {
      const nextLine = lines[lineIndex + 1];
      
      let nextLineStart = 0;
      for (let i = 0; i <= lineIndex; i++) {
        nextLineStart += lines[i].length + 1;
      }
      
      const newColumn = Math.min(column, nextLine.length);
      const newPosition = nextLineStart + newColumn;
      
      // Aquí deberías llamar a una función que actualice la posición del cursor
      // onNavigateDown(newPosition);
    }
  };

  // Función auxiliar para obtener línea y columna actual
  const getCurrentLineAndColumn = (position: number) => {
    const lines = code.split('\n');
    let totalChars = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineEnd = totalChars + lines[i].length;
      if (position <= lineEnd) {
        return {
          lineIndex: i,
          column: position - totalChars,
          lines,
        };
      }
      totalChars = lineEnd + 1;
    }

    return {
      lineIndex: lines.length - 1,
      column: lines[lines.length - 1].length,
      lines,
    };
  };

  const styles = StyleSheet.create({
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

  return (
    <View style={styles.footer}>
      {/* Menú "Más" expandible */}
      <NavigationMenu
        show={showMoreMenu}
        slideAnim={slideAnim}
        onFormatCode={onFormatCode}
        onNavigateUp={handleNavigateUp}
        onNavigateDown={handleNavigateDown}
        onDuplicateLine={onDuplicateLine}
        onToggleComment={onToggleComment}
      />

      {/* TabBar principal */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, !canUndo && styles.tabButtonDisabled]} 
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Icon name="undo" size={moderateScale(20)} color={!canUndo ? COLOR.textSecondary : COLOR.icon} />
          <Text style={[styles.tabButtonText, !canUndo && styles.tabButtonTextDisabled]}>Deshacer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, !canRedo && styles.tabButtonDisabled]} 
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Icon name="redo" size={moderateScale(20)} color={!canRedo ? COLOR.textSecondary : COLOR.icon} />
          <Text style={[styles.tabButtonText, !canRedo && styles.tabButtonTextDisabled]}>Rehacer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton} onPress={onNavigateLeft}>
          <Icon name="chevron-left" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.tabButtonText}>Izquierda</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton} onPress={onNavigateRight}>
          <Icon name="chevron-right" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.tabButtonText}>Derecha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, showMoreMenu && styles.tabButtonActive]} 
          onPress={onMoreMenuToggle}
        >
          <Icon name="dots-horizontal" size={moderateScale(20)} color={showMoreMenu ? COLOR.primary : COLOR.icon} />
          <Text style={[styles.tabButtonText, showMoreMenu && styles.tabButtonTextActive]}>Más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
