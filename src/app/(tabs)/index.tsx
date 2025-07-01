import { Icon } from '@/src/constants/icons';
import { useAuth } from '@/src/hooks/useAuth';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

const Home = () => {
  const { user } = useAuth();
  const { importFile } = useSidebarContext();
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  // Función para importar archivo
  const handleImportFile = async () => {
    try {
      await importFile();
      Alert.alert('✅ Archivo Importado', 'El archivo se importó correctamente y está disponible en el editor.');
      // Navegar al editor
      router.push('/(editor)/editor');
    } catch {
      Alert.alert('❌ Error', 'No se pudo importar el archivo. Inténtalo de nuevo.');
    }
  };

  // Función para importar carpeta (simulada - en móvil no es posible importar carpetas completas)
  const handleImportFolder = () => {
    Alert.alert(
      '📁 Importar Carpeta',
      'En dispositivos móviles no es posible importar carpetas completas. ¿Te gustaría importar archivos individuales?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Importar Archivos', onPress: handleImportFile }
      ]
    );
  };

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      {/* Header */}
      <View style={getStyles(COLOR).header}>
        <View style={getStyles(COLOR).headerLeft}>
          <View style={getStyles(COLOR).avatarCircle}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24) }} />
            ) : (
              <Icon name="account-circle-outline" size={moderateScale(38)} color={COLOR.icon} />
            )}
          </View>
          <View style={[getStyles(COLOR).headerTextContainer, { marginLeft: 8 }]}>
            <Text style={[getStyles(COLOR).welcomeText, { marginBottom: 2 }]}>Bienvenido</Text>
            <Text style={getStyles(COLOR).usernameText}>{user?.nombre && user?.apellido ? user.nombre + ' ' + user.apellido : user?.nombre || user?.username || 'Usuario'}</Text>
          </View>
        </View>
        <TouchableOpacity style={getStyles(COLOR).headerRight}>
          <View style={getStyles(COLOR).searchCircle}>
            <Icon name="magnify" size={moderateScale(22)} color={COLOR.icon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Body con Scroll */}
      <ScrollView style={getStyles(COLOR).body} contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        {/* Inicio */}
        <Text style={getStyles(COLOR).sectionTitle}>Inicio</Text>
        <View style={getStyles(COLOR).quickActions}>
          <TouchableOpacity
            style={getStyles(COLOR).quickAction}
            onPress={() => router.push({ pathname: '/(main)/new_project', params: { from: 'index' } })}
          >
            <Icon name="addfile" type="ant" size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Nuevo Proyecto...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getStyles(COLOR).quickAction}
            onPress={handleImportFile}
          >
            <Icon name="file-open" type='materialIcons' size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Abrir Archivo...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getStyles(COLOR).quickAction}
            onPress={handleImportFolder}
          >
            <Icon name="folderopen" type='ant' size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Abrir Carpeta...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={getStyles(COLOR).quickAction}>
            <Icon name="source-branch" size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Clonar Repositorio Git...</Text>
          </TouchableOpacity>
        </View>

        {/* Actividad Reciente */}
        <Text style={getStyles(COLOR).sectionTitle}>Actividad Reciente</Text>
        <View style={getStyles(COLOR).recentActivity}>
          <Icon name="calendar-blank-outline" size={moderateScale(32)} color={COLOR.icon} />
          <View style={getStyles(COLOR).activityTextContainer}>
            <Text style={getStyles(COLOR).activityTitle}>GTA VI</Text>
            <Text style={getStyles(COLOR).activitySubtitle}>Ultima vez editado hace 3h</Text>
          </View>
        </View>

        {/* Lenguajes más utilizados */}
        <Text style={getStyles(COLOR).sectionTitle}>Lenguajes más utilizados</Text>
        <View style={getStyles(COLOR).languagesList}>
          <View style={getStyles(COLOR).languageItem}>
            <Image
              source={require('@/src/assets/images/python.png')}
              style={getStyles(COLOR).languageIcon}
            />
            <View>
              <Text style={getStyles(COLOR).languageName}>Python</Text>
              <Text style={getStyles(COLOR).languageTime}>20hs en la ultima semana</Text>
            </View>
          </View>
          <View style={getStyles(COLOR).languageItem}>
            <Image
              source={require('@/src/assets/images/java.png')}
              style={getStyles(COLOR).languageIcon}
            />
            <View>
              <Text style={getStyles(COLOR).languageName}>Java</Text>
              <Text style={getStyles(COLOR).languageTime}>14hs en la ultima semana</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function getStyles(COLOR: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR.background,
      paddingHorizontal: moderateScale(20),
      paddingTop: verticalScale(16),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: verticalScale(6),
      paddingTop: verticalScale(32),
      marginBottom: verticalScale(18),
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarCircle: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: moderateScale(24),
      backgroundColor: COLOR.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scale(10),
    },
    headerTextContainer: {
      justifyContent: 'center',
    },
    welcomeText: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
    },
    usernameText: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(18),
      fontWeight: 'bold',
    },
    headerRight: {},
    searchCircle: {
      width: moderateScale(38),
      height: moderateScale(38),
      borderRadius: moderateScale(19),
      backgroundColor: COLOR.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      flex: 1,
    },
    sectionTitle: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(15),
      marginTop: verticalScale(18),
      marginBottom: verticalScale(8),
      fontWeight: 'bold',
    },
    quickActions: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: scale(18),
      marginBottom: verticalScale(18),
    },
    quickAction: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      gap: scale(10),
    },
    quickActionText: {
      color: COLOR.primary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    recentActivity: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      marginBottom: verticalScale(18),
      gap: scale(10),
    },
    activityTextContainer: {
      marginLeft: scale(10),
    },
    activityTitle: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    activitySubtitle: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(13),
    },
    languagesList: {
      marginTop: verticalScale(8),
      gap: verticalScale(10),
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(10),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      marginBottom: verticalScale(8),
      gap: scale(10),
    },
    languageIcon: {
      width: moderateScale(38),
      height: moderateScale(38),
      marginRight: scale(10),
    },
    languageName: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    languageTime: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(13),
    },
  });
}

export default Home;