import { Icon } from '@/src/constants/icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getColorsByTheme } from '../../constants/themeColors';
import { useLanguage } from '../../utils/contexts/LanguageContext';
import { useTheme } from '../../utils/contexts/ThemeContext';

const Settings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const styles = getStyles(COLOR);

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
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/language_selector')}>
            <Icon name="translate" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Idioma</Text>
            <Text style={styles.languageLabel}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/profile')}>
            <Icon name="account-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/contactanos')}>
            <Icon name="email-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Contáctanos</Text>
          </TouchableOpacity>
        </View>

        {/* Developer Section */}
        <Text style={styles.sectionTitle}>Desarrollo</Text>
        <View style={styles.sectionBox}>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/file_system_demo')}>
            <Icon name="folder-cog-outline" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Demo Sistema de Archivos</Text>
            <Text style={styles.languageLabel}>NUEVO</Text>
          </TouchableOpacity>
        </View>

        {/* Seguridad Section */}
        <Text style={styles.sectionTitle}>Seguridad</Text>
        <View style={styles.sectionBox}>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/cambiar_contrasena')}>
            <Icon name="lock-reset" size={22} color={COLOR.icon} />
            <Text style={styles.itemText}>Cambiar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRow} onPress={() => router.push('/(settings)/politicas_privacidad')}>
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
          {/* Botón de tema */}
          <View style={[styles.itemRow, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.itemText}>Tema</Text>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={{ padding: 4 }}>
              <Icon
                name={theme === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'}
                size={28}
                color={theme === 'dark' ? COLOR.icon : '#FFD600'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Cambiar a función para recibir COLOR dinámico
function getStyles(COLOR: any) {
  return StyleSheet.create({
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
}

export default Settings;