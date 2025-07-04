import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const ButtonComponent = ({ title, onPress, disabled }: any) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(18),
  },
  buttonText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default ButtonComponent;