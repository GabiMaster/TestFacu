import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const CODE_TEMPLATES: Record<string, string> = {
  Python: `print("Hola Mundo")`,
  Java: `public class HolaMundo {
    public static void main (String[] args) {
        System.out.println("Hola Mundo");
    }
}`,
  JavaScript: `console.log("Hola Mundo");`,
  Html: `<!DOCTYPE html>
<html>
  <head>
    <title>Hola Mundo</title>
  </head>
  <body>
    <h1>Hola Mundo</h1>
  </body>
</html>`,
  MySQL: `SELECT 'Hola Mundo';`,
};

const Editor = () => {
    const params = useLocalSearchParams<{ language?: string }>();
    const language = params.language;
    const [code, setCode] = useState('');

    useEffect(() => {
    if (language && CODE_TEMPLATES[language]) {
      setCode(CODE_TEMPLATES[language]);
    } else {
      setCode('');
    }
  }, [language]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Icon name="arrow-left" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{language ? language : ''}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="dots-horizontal" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={verticalScale(10)}
      >
        <ScrollView
          style={styles.codeContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            placeholder="Escribe tu código aquí..."
            placeholderTextColor={COLOR.textSecondary}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer (espacio para la tabBar del editor) */}
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
    paddingTop: verticalScale(8),
  },
  headerIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: COLOR.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    width: '100%',
  },
  codeContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLOR.background,
    borderRadius: moderateScale(12),
    padding: moderateScale(8),
  },
  codeInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    minHeight: verticalScale(300),
    textAlignVertical: 'top',
    lineHeight: moderateScale(22),
  },
  footer: {
    height: verticalScale(48), // Espacio para la tabBar del editor
  },
});

export default Editor;