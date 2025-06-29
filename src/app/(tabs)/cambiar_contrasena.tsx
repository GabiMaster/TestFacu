import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../constants/colors';
import { Icon } from '../../constants/icons';

const CambiarContrasena = () => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = () => {
    if (!current || !newPass || !repeat) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (newPass !== repeat) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Éxito', 'Contraseña cambiada correctamente.');
      setCurrent('');
      setNewPass('');
      setRepeat('');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/settings')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar contraseña</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Contraseña actual</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={current}
            onChangeText={setCurrent}
            placeholder="Contraseña actual"
            placeholderTextColor={COLOR.textSecondary}
            secureTextEntry={!showCurrent}
          />
          <TouchableOpacity onPress={() => setShowCurrent(v => !v)}>
            <Icon name={showCurrent ? 'eye' : 'eye-off'} size={22} color={COLOR.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Nueva contraseña</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPass}
            onChangeText={setNewPass}
            placeholder="Nueva contraseña"
            placeholderTextColor={COLOR.textSecondary}
            secureTextEntry={!showNew}
          />
          <TouchableOpacity onPress={() => setShowNew(v => !v)}>
            <Icon name={showNew ? 'eye' : 'eye-off'} size={22} color={COLOR.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Repetir nueva contraseña</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={repeat}
            onChangeText={setRepeat}
            placeholder="Repetir nueva contraseña"
            placeholderTextColor={COLOR.textSecondary}
            secureTextEntry={!showRepeat}
          />
          <TouchableOpacity onPress={() => setShowRepeat(v => !v)}>
            <Icon name={showRepeat ? 'eye' : 'eye-off'} size={22} color={COLOR.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleChange} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(18),
    paddingTop: verticalScale(32), 
  },
  backButton: {
    marginRight: moderateScale(12),
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  body: {
    marginTop: verticalScale(12),
  },
  label: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    marginBottom: 4,
    marginTop: verticalScale(12),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  input: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(10),
  },
  saveButton: {
    backgroundColor: COLOR.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  saveButtonText: {
    color: COLOR.textPrimary,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});

export default CambiarContrasena;
