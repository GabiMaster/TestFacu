import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useLanguage } from '../../utils/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'Inglés' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Francés' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chino' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Portugués' },
  { code: 'ja', label: 'Japonés' },
];

const LanguageSelector = () => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState(language);

  const handleSelect = (code: string) => {
    setSelected(code as any);
    setLanguage(code as any);
    setTimeout(() => router.back(), 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/settings')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar idioma</Text>
      </View>
      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        contentContainerStyle={{ paddingBottom: verticalScale(32) }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageRow,
              selected === item.code && styles.selectedRow,
            ]}
            onPress={() => handleSelect(item.code)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageText}>{item.label}</Text>
            {selected === item.code && (
              <Icon name="check-circle" size={24} color={COLOR.primary} />
            )}
          </TouchableOpacity>
        )}
      />
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
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(18),
    marginBottom: verticalScale(10),
    elevation: 1,
  },
  selectedRow: {
    borderWidth: 2,
    borderColor: COLOR.primary,
    backgroundColor: COLOR.surfaceLight,
  },
  languageText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});

export default LanguageSelector;
