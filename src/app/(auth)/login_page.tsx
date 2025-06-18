import ButtonComponent from '@/src/components/atoms/ButtonComponent';
import imagePath from '@/src/constants/imagePath';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>Ingresar</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Image source={imagePath.email} style={styles.icon} resizeMode='contain'/>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#A2A2A7"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          
            <View style={styles.inputRow}>
              <Image source={imagePath.lock} style={styles.icon} resizeMode='contain'/>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#A2A2A7"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={showPassword ? imagePath.eyeOff : imagePath.eye}
                  style={styles.icon}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
            <ButtonComponent title="Ingresar"/>
          </View>
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Soy nuevo usuario. </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Registrarme</Text>
            </TouchableOpacity>
          </View>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.socialText}>O puedes ingresar con:</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image source={imagePath.google} style={styles.socialIcon} resizeMode='contain'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={imagePath.github} style={styles.socialIcon} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    paddingHorizontal: moderateScale(24),
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: verticalScale(32),
  },
  title: {
    color: '#fff',
    fontSize: moderateScale(32),
    marginBottom: verticalScale(32),
  },
  inputContainer: {
    alignItems: 'center',
    gap: moderateScale(18),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1E1E2D',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: '#23233A',
  },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(12),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  registerText: {
    color: '#A1A1A9',
    fontSize: moderateScale(15),
  },
  registerLink: {
    color: '#2563EB',
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  socialText: {
    color: '#A1A1A9',
    fontSize: moderateScale(15),
    marginBottom: verticalScale(18),
  },
  socialIcons: {
    flexDirection: 'row',
    gap: scale(24),
  },
  socialIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    marginHorizontal: scale(12),
  },
});

export default LoginPage;