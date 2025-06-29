import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../constants/colors';
import { Icon } from '../../constants/icons';
import { useAuth } from '../../hooks/useAuth';

const EditPersonalInfo = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState(user?.nombre || user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser({ nombre, email, telefono, username: nombre });
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Información</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre Completo"
          placeholderTextColor={COLOR.textSecondary}
        />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          placeholderTextColor={COLOR.textSecondary}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Teléfono"
          placeholderTextColor={COLOR.textSecondary}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
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
    paddingTop: verticalScale(32)
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
  input: {
    backgroundColor: COLOR.surface,
    color: COLOR.textPrimary,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(16),
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

export default EditPersonalInfo;
