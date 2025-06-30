import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
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
  return (
    <View style={styles.footer}>
      <View style={styles.footerInfo}>
        <Text style={styles.fileCount}>
          {fileCount} archivo{fileCount !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={styles.footerActions}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={onSettings}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="cog-outline" size={moderateScale(16)} color={COLOR.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={onHelp}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="help-circle-outline" size={moderateScale(16)} color={COLOR.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    paddingBottom: verticalScale(16),
    backgroundColor: COLOR.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    minHeight: moderateScale(36),
  },
  footerInfo: {
    flex: 1,
  },
  fileCount: {
    color: COLOR.textSecondary,
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