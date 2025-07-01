import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface EditorHeaderProps {
  fileName: string;
  isSaving: boolean;
  isRunning: boolean;
  showConsole: boolean;
  hasUnsavedChanges?: boolean;
  onMenuPress: () => void;
  onSavePress: () => void;
  onSearchPress: () => void;
  onConsoleToggle: () => void;
  onRunPress: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  fileName,
  isSaving,
  isRunning,
  showConsole,
  hasUnsavedChanges = false,
  onMenuPress,
  onSavePress,
  onSearchPress,
  onConsoleToggle,
  onRunPress,
}) => {
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      paddingHorizontal: scale(16),
      marginTop: verticalScale(34),
      borderBottomColor: COLOR.border,
      borderBottomWidth: 1,
      height: verticalScale(50),
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuButton: {
      padding: scale(8),
      backgroundColor: COLOR.surfaceLight,
      borderRadius: 4,
    },
    fileName: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      marginLeft: scale(12),
      backgroundColor: COLOR.surfaceLight,
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      borderRadius: 4,
      color: COLOR.textPrimary,
    },
    unsavedIndicator: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: COLOR.warning,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },
    headerButton: {
      padding: scale(8),
      backgroundColor: COLOR.surfaceLight,
      borderRadius: 4,
    },
    headerButtonActive: {
      backgroundColor: COLOR.primary + '22',
    },
    runButton: {
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
      backgroundColor: COLOR.primary,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Icon name="menu" size={moderateScale(20)} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.fileName}>
          {fileName}
          {hasUnsavedChanges && <Text style={styles.unsavedIndicator}> •</Text>}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={[styles.headerButton, isSaving && styles.buttonDisabled]} 
          onPress={onSavePress}
          disabled={isSaving}
        >
          <Icon name={isSaving ? "loading" : "content-save"} size={moderateScale(20)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onSearchPress}>
          <Icon name="magnify" size={moderateScale(20)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerButton, showConsole && styles.headerButtonActive]} 
          onPress={onConsoleToggle}
        >
          <Icon name="console" size={moderateScale(20)} color={showConsole ? COLOR.primary : COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.runButton, isRunning && styles.buttonDisabled]} 
          onPress={onRunPress}
          disabled={isRunning}
        >
          <Icon name={isRunning ? "loading" : "play"} size={moderateScale(20)} color={COLOR.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};