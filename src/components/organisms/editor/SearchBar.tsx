import { SearchInput, SearchInputRef } from '@/src/components/molecules/SearchInput';
import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SearchBarProps {
  searchText: string;
  searchMatches: number[];
  currentMatchIndex: number;
  onSearchTextChange: (text: string) => void;
  onSearchNext: () => { position: number; length: number; selection: { start: number; end: number } } | null;
  onSearchPrevious: () => { position: number; length: number; selection: { start: number; end: number } } | null;
  onUpdateMatches: (text: string, search: string) => { position: number; length: number; selection: { start: number; end: number } } | null;
  onNavigateToMatch: (selection: { start: number; end: number }) => void; // Para navegación automática (sin foco)
  onNavigateToMatchWithFocus: (selection: { start: number; end: number }) => void; // Para navegación manual (con foco)
  code: string;
}

export interface SearchBarRef {
  focusSearchInput: () => void;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({
  searchText,
  searchMatches,
  currentMatchIndex,
  onSearchTextChange,
  onSearchNext,
  onSearchPrevious,
  onUpdateMatches,
  onNavigateToMatch,
  onNavigateToMatchWithFocus,
  code,
}, ref) => {
  const searchInputRef = useRef<SearchInputRef>(null);
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  useImperativeHandle(ref, () => ({
    focusSearchInput: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
  }));
  const handleSearchTextChange = (text: string) => {
    onSearchTextChange(text);
    const result = onUpdateMatches(code, text);
    // Si hay una coincidencia, navegar automáticamente a la primera
    if (result) {
      onNavigateToMatch(result.selection);
    }
  };

  const handleSearchNext = () => {
    const result = onSearchNext();
    if (result) {
      onNavigateToMatchWithFocus(result.selection); // Navegación manual con foco
    } else {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
    }
  };

  const handleSearchPrevious = () => {
    const result = onSearchPrevious();
    if (result) {
      onNavigateToMatchWithFocus(result.selection); // Navegación manual con foco
    } else {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
    }
  };

  const handleClearSearch = () => {
    onSearchTextChange('');
  };

  const styles = StyleSheet.create({
    searchContainer: {
      backgroundColor: COLOR.surface,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
      borderBottomWidth: 1,
      borderBottomColor: COLOR.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },
    searchActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),
    },
    searchCounter: {
      fontSize: moderateScale(12),
      color: COLOR.textSecondary,
      minWidth: scale(40),
      textAlign: 'center',
    },
    searchCounterActive: {
      color: COLOR.primary,
    },
    searchCounterInactive: {
      color: COLOR.textSecondary,
    },
    searchActionButton: {
      padding: moderateScale(4),
      backgroundColor: COLOR.surfaceLight,
      borderRadius: moderateScale(4),
    },
    searchActionButtonDisabled: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.searchContainer}>
      <SearchInput
        ref={searchInputRef}
        value={searchText}
        onChangeText={handleSearchTextChange}
        placeholder="Buscar en el código..."
        onClear={handleClearSearch}
        autoFocus={true}
      />
      
      <View style={styles.searchActions}>
        <Text style={[
          styles.searchCounter,
          searchMatches.length > 0 ? styles.searchCounterActive : styles.searchCounterInactive
        ]}>
          {searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0'}
        </Text>
        <TouchableOpacity 
          style={[
            styles.searchActionButton,
            searchMatches.length === 0 && styles.searchActionButtonDisabled
          ]} 
          onPress={handleSearchPrevious}
          disabled={searchMatches.length === 0}
        >
          <Icon name="chevron-up" size={moderateScale(16)} color={searchMatches.length > 0 ? COLOR.icon : COLOR.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.searchActionButton,
            searchMatches.length === 0 && styles.searchActionButtonDisabled
          ]} 
          onPress={handleSearchNext}
          disabled={searchMatches.length === 0}
        >
          <Icon name="chevron-down" size={moderateScale(16)} color={searchMatches.length > 0 ? COLOR.icon : COLOR.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

SearchBar.displayName = 'SearchBar';