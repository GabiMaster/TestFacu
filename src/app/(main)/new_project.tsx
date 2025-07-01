import ButtonComponent from '@/src/components/atoms/ButtonComponent';
import { Icon } from '@/src/constants/icons';
import imagePath from '@/src/constants/imagePath';
import { useProjectContext } from '@/src/utils/contexts/ProjectContext';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

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
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const { createProject, openProject } = useProjectContext();
  const { updateFiles } = useSidebarContext();

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

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es obligatorio');
      return;
    }
    
    if (!selectedLanguage) {
      Alert.alert('Error', 'Debes seleccionar un lenguaje de programación');
      return;
    }

    try {
      setIsCreating(true);
      
      // Crear el proyecto
      const newProject = await createProject(
        projectName.trim(),
        projectDescription.trim() || undefined,
        selectedLanguage.name.toLowerCase(),
        'custom'
      );
      
      // Abrir el proyecto creado
      const openedProject = await openProject(newProject);
      
      // Actualizar la sidebar con los archivos del proyecto
      if (openedProject.fileStructure && openedProject.fileStructure.length > 0) {
        updateFiles(openedProject.fileStructure);
      }
      
      // Navegar al editor
      router.push('/(editor)/editor');
      
    } catch (error) {
      console.error('❌ Error creating project:', error);
      Alert.alert('Error', 'No se pudo crear el proyecto. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      {/* Header */}
      <View style={getStyles(COLOR).header}>
        <TouchableOpacity style={getStyles(COLOR).headerIcon} onPress={handleBack}>
          <Icon name="arrow-left" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={getStyles(COLOR).headerTitle}>Nuevo Proyecto</Text>
        <TouchableOpacity style={getStyles(COLOR).headerIcon}>
          <Icon name="dots-horizontal" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={getStyles(COLOR).body}>
        <Text style={getStyles(COLOR).welcomeTitle}>Bienvenido a{'\n'}CodeFarmEditor</Text>
        <Text style={getStyles(COLOR).subtitle}>
          Empieza tu aventura en{'\n'}el mundo de la codificación
        </Text>
        
        {/* Formulario del proyecto */}
        <View style={getStyles(COLOR).formContainer}>
          <View style={getStyles(COLOR).inputGroup}>
            <Text style={getStyles(COLOR).inputLabel}>Nombre del proyecto *</Text>
            <TextInput
              style={getStyles(COLOR).textInput}
              placeholder="Mi nuevo proyecto"
              placeholderTextColor={COLOR.textSecondary}
              value={projectName}
              onChangeText={setProjectName}
            />
          </View>
          
          <View style={getStyles(COLOR).inputGroup}>
            <Text style={getStyles(COLOR).inputLabel}>Descripción (opcional)</Text>
            <TextInput
              style={[getStyles(COLOR).textInput, getStyles(COLOR).textAreaInput]}
              placeholder="Descripción del proyecto..."
              placeholderTextColor={COLOR.textSecondary}
              value={projectDescription}
              onChangeText={setProjectDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={getStyles(COLOR).selectLanguageButton}
          onPress={() => setShowModal(true)}
        >
          {selectedLanguage ? (
            <View style={getStyles(COLOR).selectedLangRow}>
              <Image source={selectedLanguage.image} style={getStyles(COLOR).languageIcon} />
              <Text style={getStyles(COLOR).selectLanguageText}>{selectedLanguage.name}</Text>
            </View>
          ) : (
            <Text style={getStyles(COLOR).selectLanguageText}>Selecciona el lenguaje</Text>
          )}
        </TouchableOpacity>
        <View style={getStyles(COLOR).continueButtonWrapper}>
          <ButtonComponent
            title={isCreating ? "Creando proyecto..." : "Crear Proyecto"}
            disabled={!selectedLanguage || !projectName.trim() || isCreating}
            onPress={handleCreateProject}
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
        <View style={getStyles(COLOR).modalOverlay}>
          <View style={getStyles(COLOR).modalContent}>
            <View style={getStyles(COLOR).modalHeader}>
              <Text style={getStyles(COLOR).modalTitle}>Selecciona el lenguaje</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close" type="ant" size={moderateScale(22)} color={COLOR.icon} />
              </TouchableOpacity>
            </View>
            <View style={getStyles(COLOR).searchContainer}>
              <Icon name="search1" type="ant" size={moderateScale(20)} color={COLOR.icon} />
              <TextInput
                style={getStyles(COLOR).searchInput}
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
                    getStyles(COLOR).languageRow,
                    selectedLanguage?.name === lang.name && getStyles(COLOR).languageRowSelected,
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                >
                  <Image source={lang.image} style={getStyles(COLOR).languageIcon} />
                  <Text style={getStyles(COLOR).languageName}>{lang.name}</Text>
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
    formContainer: {
      width: '100%',
      marginVertical: verticalScale(20),
    },
    inputGroup: {
      marginBottom: verticalScale(16),
    },
    inputLabel: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(14),
      fontWeight: '600',
      marginBottom: verticalScale(8),
    },
    textInput: {
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(16),
      paddingVertical: verticalScale(12),
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      borderWidth: 1,
      borderColor: COLOR.border,
    },
    textAreaInput: {
      height: verticalScale(80),
      textAlignVertical: 'top',
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
}

export default NewProject;