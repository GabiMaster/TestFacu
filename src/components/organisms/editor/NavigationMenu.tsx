import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface NavigationMenuProps {
  show: boolean;
  slideAnim: Animated.Value;
  onFormatCode: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onDuplicateLine: () => void;
  onToggleComment: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  show,
  slideAnim,
  onFormatCode,
  onDuplicateLine,
  onToggleComment,
}) => {
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  
  if (!show) return null;

  const handleFormatCode = () => {
    onFormatCode();
  };

  const handleDuplicateLine = () => {
    onDuplicateLine();
  };

  const handleToggleComment = () => {
    onToggleComment();
  };

  const styles = StyleSheet.create({
    moreMenuContainer: {
      backgroundColor: COLOR.surface,
      borderTopWidth: 1,
      borderTopColor: COLOR.border,
      paddingHorizontal: moderateScale(16),
      paddingVertical: verticalScale(8),
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    moreMenuContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    moreMenuItem: {
      alignItems: 'center',
      paddingVertical: verticalScale(8),
      paddingHorizontal: moderateScale(12),
      borderRadius: moderateScale(6),
    },
    moreMenuItemText: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(10),
      marginTop: verticalScale(4),
    },
  });

  return (
    <Animated.View 
      style={[
        styles.moreMenuContainer,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }],
          opacity: slideAnim
        }
      ]}
    >
      <View style={styles.moreMenuContent}>
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleFormatCode}>
          <Icon name="code-tags" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuItemText}>Formatear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleDuplicateLine}>
          <Icon name="content-duplicate" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuItemText}>Duplicar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleToggleComment}>
          <Icon name="comment-outline" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuItemText}>Comentar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};