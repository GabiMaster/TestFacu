import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';

const Logout = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login_page');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/logout-figma.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>¿Cerrar sesión?</Text>
        <Text style={styles.subtitle}>
          Si cierras sesión, tendrás que volver a ingresar tus credenciales para acceder a CodeFarm.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: moderateScale(24),
  },
  image: {
    width: moderateScale(300),
    height: moderateScale(300),
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: COLOR.textPrimary,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: COLOR.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  logoutButton: {
    backgroundColor: COLOR.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(32),
    marginBottom: verticalScale(12),
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLOR.textPrimary,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  cancelButton: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(32),
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLOR.textSecondary,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});

export default Logout;
