import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onClear: () => void;
  autoFocus?: boolean;
}

export interface SearchInputRef {
  focus: () => void;
  blur: () => void;
}

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(({
  value,
  onChangeText,
  placeholder,
  onClear,
  autoFocus = false,
}, ref) => {
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    },
    blur: () => {
      if (textInputRef.current) {
        textInputRef.current.blur();
      }
    },
  }));
  return (
    <View style={styles.searchInputContainer}>
      <Icon name="magnify" size={moderateScale(18)} color={COLOR.icon} />
      <TextInput
        ref={textInputRef}
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLOR.textSecondary}
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
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
});