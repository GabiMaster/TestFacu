import { COLOR } from '@/src/constants/colors';
import React from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const images = {
  success: require('@/src/assets/images/logo feliz.png'),
  error: require('@/src/assets/images/logo malo.png'),
};

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={images[type]} style={styles.image} resizeMode="contain" />
          <Text style={[styles.message, type === 'success' ? styles.success : styles.error]}>{message}</Text>
          <Text style={styles.closeText} onPress={onClose}>Cerrar</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(16),
    padding: moderateScale(24),
    alignItems: 'center',
    width: '80%',
  },
  image: {
    width: moderateScale(80),
    height: moderateScale(80),
    marginBottom: verticalScale(12),
  },
  message: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: verticalScale(16),
    fontWeight: 'bold',
  },
  success: {
    color: COLOR.primary,
  },
  error: {
    color: COLOR.error || '#e53935',
  },
  closeText: {
    color: COLOR.primary,
    fontWeight: 'bold',
    fontSize: moderateScale(15),
    marginTop: verticalScale(8),
    textDecorationLine: 'underline',
  },
});

export default CustomAlert;
