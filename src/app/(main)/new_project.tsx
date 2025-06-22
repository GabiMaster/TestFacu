import ButtonComponent from '@/src/components/atoms/ButtonComponent';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import imagePath from '@/src/constants/imagePath';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const LANGUAGES = [
  { name: 'Python', image: imagePath.python },
  { name: 'Java', image: imagePath.java },
  { name: 'JavaScript', image: require('@/src/assets/images/javascript.png') },
  { name: 'Html', image: require('@/src/assets/images/html5.png') },
  { name: 'MySQL', image: require('@/src/assets/images/mysql.png') },
];

const NewProject = () => {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<null | typeof LANGUAGES[0]>(null);
  const [search, setSearch] = useState('');

  const handleBack = () => {
    if (from === 'projects') {
      router.replace('/(tabs)/projects');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSelectLanguage = (lang: typeof LANGUAGES[0]) => {
    setSelectedLanguage(lang);
    handleCloseModal();
  };

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
  setShowModal(false);
  setSearch('');
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={handleBack}>
          <Icon name="arrow-left" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Proyecto</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="dots-horizontal" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.welcomeTitle}>Bienvenido a{'\n'}CodeFarmEditor</Text>
        <Text style={styles.subtitle}>
          Empieza tu aventura en{'\n'}el mundo de la codificación
        </Text>
        <TouchableOpacity
          style={styles.selectLanguageButton}
          onPress={() => setShowModal(true)}
        >
          {selectedLanguage ? (
            <View style={styles.selectedLangRow}>
              <Image source={selectedLanguage.image} style={styles.languageIcon} />
              <Text style={styles.selectLanguageText}>{selectedLanguage.name}</Text>
            </View>
          ) : (
            <Text style={styles.selectLanguageText}>Selecciona el lenguaje</Text>
          )}
        </TouchableOpacity>
        <View style={styles.continueButtonWrapper}>
          <ButtonComponent
            title="Continuar"
            disabled={!selectedLanguage}
            onPress={() =>
              router.push({
                pathname: '/(editor)/editor',
                params: { language: selectedLanguage?.name }
              })
            }
          />
        </View>
      </View>

      {/* Modal de selección de lenguaje */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona el lenguaje</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close" type="ant" size={moderateScale(22)} color={COLOR.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Icon name="search1" type="ant" size={moderateScale(20)} color={COLOR.icon} />
              <TextInput
                style={styles.searchInput}
                placeholder="buscar"
                placeholderTextColor={COLOR.icon}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <ScrollView style={{ width: '100%' }}>
              {filteredLanguages.map((lang, idx) => (
                <TouchableOpacity
                  key={lang.name}
                  style={[
                    styles.languageRow,
                    selectedLanguage?.name === lang.name && styles.languageRowSelected,
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                >
                  <Image source={lang.image} style={styles.languageIcon} />
                  <Text style={styles.languageName}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
              {filteredLanguages.length === 0 && (
                <Text style={{ color: COLOR.textSecondary, textAlign: 'center', marginTop: 16 }}>
                  No se encontraron lenguajes.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    marginBottom: verticalScale(18),
    paddingTop: verticalScale(32),
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
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: verticalScale(180),
    gap: verticalScale(16),
  },
  welcomeTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(36),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  subtitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(24),
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  selectLanguageButton: {
    alignItems: 'center',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(24),
    width: '90%',
    marginTop: verticalScale(16),
  },
  selectLanguageText: {
    color: COLOR.primary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  selectedLangRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    marginRight: moderateScale(10),
    borderRadius: moderateScale(8),
    backgroundColor: COLOR.surface,
  },
  continueButtonWrapper: {
    width: '90%',
    marginTop: verticalScale(24),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  modalContent: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surfaceLight,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(18),
    width: '100%',
    gap: 8,
  },
  searchInput: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(15),
    marginLeft: 8,
    flex: 1,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(6),
    width: '100%',
  },
  languageRowSelected: {
    backgroundColor: COLOR.primary + '22',
  },
  languageName: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default NewProject;