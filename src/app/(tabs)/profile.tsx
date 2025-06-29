import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../constants/colors';
import { Icon } from '../../constants/icons';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogoutPress = () => {
    router.push('/(tabs)/logout');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con gradiente y avatar */}
      <LinearGradient colors={[COLOR.primary, COLOR.primaryDark]} style={styles.headerGradient}>
        <View style={styles.avatarCircle}>
          <Icon name="account-circle-outline" size={moderateScale(60)} color={COLOR.icon} />
        </View>
        <Text style={styles.username}>{user?.nombre || user?.username || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email || 'correo@ejemplo.com'}</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        {/* Información Personal */}
        <TouchableOpacity style={styles.sectionBox} onPress={() => router.push('/(tabs)/edit_personal_info')}>
          <View style={styles.sectionRow}>
            <Icon name="account-outline" size={24} color={COLOR.icon} />
            <Text style={styles.sectionText}>Información Personal</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Icon name="chevron-right" size={22} color={COLOR.icon} />
            </View>
          </View>
          <View style={styles.infoPreview}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{user?.nombre || user?.username || 'Nombre'}</Text>
          </View>
          <View style={styles.infoPreview}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <Text style={styles.infoValue}>{user?.email || 'correo@ejemplo.com'}</Text>
          </View>
          <View style={styles.infoPreview}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{user?.telefono || '-'}</Text>
          </View>
        </TouchableOpacity>
        {/* Notificaciones */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionRow}>
            <Icon name="bell-outline" size={24} color={COLOR.icon} />
            <Text style={styles.sectionText}>Notificaciones</Text>
          </View>
        </View>
        {/* Mensajes */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionRow}>
            <Icon name="message-outline" size={24} color={COLOR.icon} />
            <Text style={styles.sectionText}>Mensajes</Text>
          </View>
        </View>
      </ScrollView>
      {/* Botón de logout/cambiar cuenta abajo a la derecha */}
      <TouchableOpacity style={styles.logoutButtonBottom} onPress={handleLogoutPress}>
        <Icon name="logout" size={28} color={COLOR.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.rollbackButton} onPress={() => router.replace('/(tabs)/settings')}>
        <Icon name="arrow-left" size={22} color={COLOR.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  headerGradient: {
    alignItems: 'center',
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(32),
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    marginBottom: verticalScale(18),
    position: 'relative',
  },
  avatarCircle: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: COLOR.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    borderWidth: 3,
    borderColor: COLOR.primaryLight,
  },
  username: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    marginBottom: 8,
  },
  sectionBox: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(14),
    marginHorizontal: moderateScale(18),
    marginBottom: verticalScale(14),
    padding: moderateScale(14),
    elevation: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginBottom: verticalScale(6),
  },
  sectionText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  infoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(2),
    marginLeft: scale(32),
    gap: scale(6),
  },
  infoLabel: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    minWidth: 60,
  },
  infoValue: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
  },
  logoutButtonBottom: {
    position: 'absolute',
    bottom: verticalScale(32),
    right: moderateScale(32),
    backgroundColor: COLOR.surfaceLight,
    borderRadius: moderateScale(32),
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  rollbackButton: {
    position: 'absolute',
    top: verticalScale(32),
    left: moderateScale(32),
    backgroundColor: COLOR.surfaceLight,
    borderRadius: moderateScale(32),
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default Profile;
