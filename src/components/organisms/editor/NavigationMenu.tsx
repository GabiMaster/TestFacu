import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
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
      <View style={styles.moreMenu}>
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleFormatCode}>
          <Icon name="code-tags" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuText}>Formatear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleDuplicateLine}>
          <Icon name="content-duplicate" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuText}>Duplicar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreMenuItem} onPress={handleToggleComment}>
          <Icon name="comment-outline" size={moderateScale(20)} color={COLOR.icon} />
          <Text style={styles.moreMenuText}>Comentar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  moreMenuContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLOR.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  moreMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(8),
  },
  moreMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    minWidth: moderateScale(48),
    gap: verticalScale(2),
  },
  moreMenuText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
});