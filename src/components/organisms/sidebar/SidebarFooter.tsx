import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SidebarFooterProps {
  fileCount: number;
  onSettings: () => void;
  onHelp: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  fileCount,
  onSettings,
  onHelp
}) => {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

  return (
    <View style={getStyles(colors).footer}>
      <View style={getStyles(colors).footerInfo}>
        <Text style={getStyles(colors).fileCount}>
          {fileCount} archivo{fileCount !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={getStyles(colors).footerActions}>
        <TouchableOpacity 
          style={getStyles(colors).footerButton}
          onPress={onSettings}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="cog-outline" size={moderateScale(16)} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={getStyles(colors).footerButton}
          onPress={onHelp}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="help-circle-outline" size={moderateScale(16)} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    paddingBottom: verticalScale(16),
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: moderateScale(36),
  },
  footerInfo: {
    flex: 1,
  },
  fileCount: {
    color: colors.textSecondary,
    fontSize: moderateScale(11),
    fontWeight: '400',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  footerButton: {
    padding: moderateScale(4),
    borderRadius: moderateScale(4),
  },
});