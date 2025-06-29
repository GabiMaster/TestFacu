import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useLanguage } from '../../utils/contexts/LanguageContext';

const Settings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>

        {/* General Section */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.sectionBox}>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(tabs)/language_selector')}>
            <Icon name="translate" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Idioma</Text>
            <Text style={styles.languageLabel}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(tabs)/profile')}>
            <Icon name="account-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(tabs)/contactanos')}>
            <Icon name="email-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Contáctanos</Text>
          </TouchableOpacity>
        </View>

        {/* Seguridad Section */}
        <Text style={styles.sectionTitle}>Seguridad</Text>
        <View style={styles.sectionBox}>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(tabs)/cambiar_contrasena')}>
            <Icon name="lock-reset" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Cambiar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(tabs)/politicas_privacidad')}>
            <Icon name="file-document-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Políticas de privacidad</Text>
          </TouchableOpacity>
        </View>

        {/* Privacidad Section */}
        <Text style={styles.sectionTitle}>Privacidad</Text>
        <View style={styles.sectionBox}>
          <TouchableOpacity style={styles.itemRow}>
            <Icon name="database-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Elije los datos que se compartes</Text>
          </TouchableOpacity>
          <View style={[styles.itemRow, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="fingerprint" size={22} color={COLOR.icon} />
              <Text style={styles.itemText}>Biométrico</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              thumbColor={biometricEnabled ? COLOR.primary : COLOR.surface}
              trackColor={{ false: COLOR.surfaceLight, true: COLOR.primary + '55' }}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: verticalScale(32),
    marginBottom: verticalScale(18),
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(15),
    marginTop: verticalScale(18),
    marginBottom: verticalScale(8),
    fontWeight: 'bold',
  },
  sectionBox: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
    gap: verticalScale(2),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(14),
  },
  itemText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
  },
  languageLabel: {
    marginLeft: 'auto',
    color: COLOR.primary,
    fontWeight: 'bold',
    fontSize: moderateScale(13),
    backgroundColor: COLOR.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

export default Settings;