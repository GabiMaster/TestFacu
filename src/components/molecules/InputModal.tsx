import { COLOR } from '@/src/constants/colors';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface InputModalProps {
  visible: boolean;
  title: string;
  message: string;
  placeholder: string;
  defaultValue?: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  visible,
  title,
  message,
  placeholder,
  defaultValue = '',
  onConfirm,
  onCancel,
}) => {
  const [inputText, setInputText] = useState(defaultValue);

  useEffect(() => {
    if (visible) {
      setInputText(defaultValue);
    }
  }, [visible, defaultValue]);

  const handleConfirm = () => {
    console.log('🎯 InputModal confirm pressed with text:', inputText);
    if (inputText.trim()) {
      onConfirm(inputText.trim());
      setInputText('');
    } else {
      Alert.alert('Error', 'Por favor ingresa un nombre válido');
    }
  };

  const handleCancel = () => {
    console.log('🎯 InputModal cancel pressed');
    setInputText('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={placeholder}
            placeholderTextColor={COLOR.textSecondary}
            autoFocus
            selectTextOnFocus
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modal: {
    backgroundColor: COLOR.background,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    width: '100%',
    maxWidth: moderateScale(300),
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLOR.textPrimary,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  message: {
    fontSize: moderateScale(14),
    color: COLOR.textSecondary,
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: moderateScale(14),
    color: COLOR.textPrimary,
    backgroundColor: COLOR.background,
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLOR.background,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  confirmButton: {
    backgroundColor: COLOR.primary,
  },
  cancelButtonText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
