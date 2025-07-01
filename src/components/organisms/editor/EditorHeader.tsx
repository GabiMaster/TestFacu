import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
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

const styles = StyleSheet.create({
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
  unsavedIndicator: {
    color: COLOR.warning,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  headerButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(6),
    backgroundColor: COLOR.surfaceLight,
  },
  headerButtonActive: {
    backgroundColor: COLOR.primary + '22',
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
});