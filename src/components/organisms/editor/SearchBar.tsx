import { SearchInput } from '@/src/components/molecules/SearchInput';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import React from 'react';
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
  onNavigateToMatch: (selection: { start: number; end: number }) => void;
  code: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  searchMatches,
  currentMatchIndex,
  onSearchTextChange,
  onSearchNext,
  onSearchPrevious,
  onUpdateMatches,
  onNavigateToMatch,
  code,
}) => {
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
      onNavigateToMatch(result.selection);
    } else {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
    }
  };

  const handleSearchPrevious = () => {
    const result = onSearchPrevious();
    if (result) {
      onNavigateToMatch(result.selection);
    } else {
      Alert.alert('Búsqueda', 'No se encontraron coincidencias');
    }
  };

  const handleClearSearch = () => {
    onSearchTextChange('');
  };

  return (
    <View style={styles.searchContainer}>
      <SearchInput
        value={searchText}
        onChangeText={handleSearchTextChange}
        placeholder="Buscar en el código..."
        onClear={handleClearSearch}
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
};

const styles = StyleSheet.create({
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
  searchCounterActive: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  searchCounterInactive: {
    color: COLOR.textSecondary,
  },
  searchActionButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: COLOR.surfaceLight,
  },
  searchActionButtonDisabled: {
    opacity: 0.5,
  },
});