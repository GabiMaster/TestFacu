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

interface SidebarHeaderProps {
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onClose,
  onNewFile,
  onNewFolder,
  onRefresh
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>ARCHIVOS</Text>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onNewFile}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="file-plus-outline" size={moderateScale(18)} color={COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onNewFolder}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="folder-plus-outline" size={moderateScale(18)} color={COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onRefresh}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="refresh" size={moderateScale(18)} color={COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
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
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  headerButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
  },
});