import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Icon } from '../../constants/icons';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

const EMAIL = 'tikitaka@gmail.com';

const Contactanos = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const styles = getStyles(COLOR);

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${EMAIL}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/settings')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contáctanos</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>
          ¿Tenés dudas, sugerencias o encontraste algún error en la aplicación?{"\n"}
          En CodeFarm valoramos tu opinión y estamos comprometidos en mejorar la experiencia de desarrollo desde tu dispositivo móvil.{"\n\n"}
          Podés comunicarte con nosotros a través del siguiente correo electrónico:
        </Text>
        <TouchableOpacity style={styles.emailRow} onPress={handleEmailPress}>
          <Icon name="email-outline" size={22} color={COLOR.primary} />
          <Text style={styles.email}>{EMAIL}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          También podés usar este canal para:{"\n\n"}
          • Reportar errores o fallos técnicos{"\n"}
          • Enviar ideas o mejoras{"\n"}
          • Consultas generales sobre el funcionamiento de la app{"\n\n"}
          Nos comprometemos a responderte lo antes posible.{"\n"}
          ¡Gracias por ser parte de la comunidad CodeFarm! 💻
        </Text>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLOR: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR.background,
      paddingHorizontal: moderateScale(20),
      paddingTop: verticalScale(16),
    },
    header: {
      paddingTop: verticalScale(32),
      marginBottom: verticalScale(18),
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: moderateScale(12),
    },
    headerTitle: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(20),
      fontWeight: 'bold',
    },
    body: {
      marginTop: verticalScale(8),
    },
    text: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(15),
      marginBottom: verticalScale(16),
      lineHeight: 22,
    },
    emailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surfaceLight,
      borderRadius: moderateScale(8),
      padding: moderateScale(10),
      marginBottom: verticalScale(18),
      alignSelf: 'flex-start',
      gap: 8,
    },
    email: {
      color: COLOR.primary,
      fontWeight: 'bold',
      fontSize: moderateScale(15),
      marginLeft: 6,
    },
  });

export default Contactanos;