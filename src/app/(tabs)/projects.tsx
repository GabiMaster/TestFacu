import { Icon } from '@/src/constants/icons';
import { useProjectContext } from '@/src/utils/contexts/ProjectContext';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

const Projects = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  
  const {
    projects,
    isLoading,
    openProject,
    deleteProject,
    refreshProjects
  } = useProjectContext();

  const { updateFiles } = useSidebarContext();

  const [filteredProjects, setFilteredProjects] = useState(projects);

  // Actualizar proyectos cuando se carga el componente
  useEffect(() => {
    refreshProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Filtrar proyectos según la búsqueda
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase()) ||
        project.language?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [search, projects]);

  const handleProjectPress = async (project: any) => {
    try {
      console.log('📂 Opening project:', project.name);
      const openedProject = await openProject(project);
      
      // Actualizar la sidebar con los archivos del proyecto
      if (openedProject.fileStructure && openedProject.fileStructure.length > 0) {
        updateFiles(openedProject.fileStructure);
      }
      
      // Navegar al editor
      router.push('/(editor)/editor');
    } catch (error) {
      console.error('❌ Error opening project:', error);
      Alert.alert('Error', 'No se pudo abrir el proyecto. Inténtalo de nuevo.');
    }
  };

  const handleProjectLongPress = (project: any) => {
    Alert.alert(
      project.name,
      '¿Qué acción deseas realizar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Abrir', 
          onPress: () => handleProjectPress(project) 
        },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => confirmDeleteProject(project)
        },
      ]
    );
  };

  const confirmDeleteProject = (project: any) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteProject(project.id)
        }
      ]
    );
  };

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      await deleteProject(projectId);
      Alert.alert('✅ Eliminado', 'El proyecto se eliminó correctamente.');
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      Alert.alert('Error', 'No se pudo eliminar el proyecto. Inténtalo de nuevo.');
    }
  }, [deleteProject]);

  const getLanguageIcon = (language?: string) => {
    switch (language?.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'language-javascript';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'python':
      case 'py':
        return 'language-python';
      case 'java':
        return 'language-java';
      case 'html':
        return 'language-html5';
      case 'css':
        return 'language-css3';
      case 'react':
        return 'react';
      default:
        return 'file-code-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      {/* Header */}
      <View style={getStyles(COLOR).header}>
        <Text style={getStyles(COLOR).headerTitle}>Proyectos</Text>
      </View>

      {/* Body */}
      <ScrollView style={getStyles(COLOR).body} contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        <TouchableOpacity
          style={getStyles(COLOR).newProjectButton}
          onPress={() => router.push({ pathname: '/(main)/new_project', params: { from: 'projects' } })}
        >
          <Text style={getStyles(COLOR).newProjectButtonText}>Nuevo Proyecto</Text>
        </TouchableOpacity>

        {/* Search */}
        <View style={getStyles(COLOR).searchContainer}>
          <Icon name="search1" type="ant" size={moderateScale(20)} color={COLOR.icon} />
          <TextInput
            ref={inputRef}
            style={getStyles(COLOR).searchInput}
            placeholder="Buscar"
            placeholderTextColor={COLOR.icon}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                inputRef.current?.focus();
              }}
            >
              <Icon name="close" type="ant" size={moderateScale(20)} color={COLOR.icon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Projects List */}
        <View style={getStyles(COLOR).projectsList}>
          {isLoading ? (
            <View style={getStyles(COLOR).loadingContainer}>
              <ActivityIndicator size="large" color={COLOR.primary} />
              <Text style={getStyles(COLOR).loadingText}>Cargando proyectos...</Text>
            </View>
          ) : filteredProjects.length === 0 ? (
            <View style={getStyles(COLOR).emptyContainer}>
              <Icon name="folder-open-outline" size={moderateScale(48)} color={COLOR.textSecondary} />
              <Text style={getStyles(COLOR).emptyText}>
                {search.length > 0 ? 'No se encontraron proyectos' : 'No tienes proyectos creados'}
              </Text>
              <Text style={getStyles(COLOR).emptySubtext}>
                {search.length > 0 ? 'Intenta con otro término de búsqueda' : 'Crea tu primer proyecto para empezar'}
              </Text>
            </View>
          ) : (
            filteredProjects.map((project) => (
              <TouchableOpacity 
                key={project.id} 
                style={getStyles(COLOR).projectItem}
                onPress={() => handleProjectPress(project)}
                onLongPress={() => handleProjectLongPress(project)}
                activeOpacity={0.7}
              >
                <View style={getStyles(COLOR).projectIconCircle}>
                  <Icon 
                    name={getLanguageIcon(project.language)} 
                    size={moderateScale(24)} 
                    color={COLOR.primary} 
                  />
                </View>
                <View style={getStyles(COLOR).projectInfo}>
                  <Text style={getStyles(COLOR).projectName} numberOfLines={1}>
                    {project.name}
                  </Text>
                  {project.description && (
                    <Text style={getStyles(COLOR).projectDescription} numberOfLines={2}>
                      {project.description}
                    </Text>
                  )}
                  <View style={getStyles(COLOR).projectMeta}>
                    {project.language && (
                      <View style={getStyles(COLOR).languageBadge}>
                        <Text style={getStyles(COLOR).languageText}>
                          {project.language}
                        </Text>
                      </View>
                    )}
                    <Text style={getStyles(COLOR).projectDate}>
                      {formatDate(project.lastModified)}
                    </Text>
                  </View>
                </View>
                <View style={getStyles(COLOR).projectActions}>
                  <Icon 
                    name="chevron-right" 
                    size={moderateScale(20)} 
                    color={COLOR.textSecondary} 
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
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
      paddingBottom: verticalScale(6),
      paddingTop: verticalScale(32),
      marginBottom: verticalScale(18),
    },
    headerTitle: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(20),
      fontWeight: 'bold',
    },
    body: {
      flex: 1,
    },
    newProjectButton: {
      backgroundColor: COLOR.primary,
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(24),
      borderRadius: moderateScale(8),
      alignItems: 'center',
      marginBottom: verticalScale(20),
    },
    newProjectButtonText: {
      color: COLOR.textOnPrimary,
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(16),
      paddingVertical: verticalScale(12),
      marginBottom: verticalScale(20),
    },
    searchInput: {
      flex: 1,
      marginLeft: moderateScale(12),
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
    },
    projectsList: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(40),
    },
    loadingText: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(16),
      marginTop: verticalScale(12),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(40),
    },
    emptyText: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(18),
      fontWeight: '600',
      marginTop: verticalScale(16),
      textAlign: 'center',
    },
    emptySubtext: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
      marginTop: verticalScale(8),
      textAlign: 'center',
    },
    projectItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      marginBottom: verticalScale(12),
      shadowColor: COLOR.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    projectIconCircle: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: moderateScale(24),
      backgroundColor: COLOR.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: moderateScale(12),
    },
    projectInfo: {
      flex: 1,
    },
    projectName: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: '600',
      marginBottom: verticalScale(4),
    },
    projectDescription: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(8),
    },
    projectMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    languageBadge: {
      backgroundColor: COLOR.primary + '20',
      paddingHorizontal: moderateScale(8),
      paddingVertical: verticalScale(4),
      borderRadius: moderateScale(12),
      marginRight: moderateScale(8),
    },
    languageText: {
      color: COLOR.primary,
      fontSize: moderateScale(12),
      fontWeight: '500',
    },
    projectDate: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(12),
    },
    projectActions: {
      marginLeft: moderateScale(8),
    },
  });
};

export default Projects;