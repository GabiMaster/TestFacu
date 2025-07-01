import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Icon } from '../../constants/icons';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

const Mensajes = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      <View style={getStyles(COLOR).header}>
        <TouchableOpacity style={getStyles(COLOR).backButton} onPress={() => router.replace('/(settings)/profile')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={getStyles(COLOR).headerTitle}>Mensajes</Text>
      </View>
      <View style={getStyles(COLOR).body}>
        <Text style={getStyles(COLOR).text}>
          No tienes mensajes por el momento.
        </Text>
      </View>
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
      textAlign: 'left',
    },
  });
}

export default Mensajes;
