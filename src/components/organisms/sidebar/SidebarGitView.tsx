import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { FileSystemManager } from '@/src/utils/fileSystem/FileSystemManager';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SidebarGitViewProps {
  onClose: () => void;
}

export const SidebarGitView: React.FC<SidebarGitViewProps> = ({ onClose }) => {
  const { updateFiles } = useSidebarContext();
  const [repoUrl, setRepoUrl] = useState('');
  const [isCloning, setIsCloning] = useState(false);

  const handleCloneRepository = async () => {
    if (!repoUrl.trim()) {
      Alert.alert('Error', 'Por favor ingresa la URL del repositorio');
      return;
    }

    // Validación y extracción de información del repositorio de GitHub
    const githubMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (!githubMatch) {
      Alert.alert('Error', 'Por ahora solo se soportan repositorios de GitHub públicos.\nFormato: https://github.com/usuario/repositorio');
      return;
    }

    const [, owner, repo] = githubMatch;
    const repoName = repo.replace('.git', '');

    setIsCloning(true);
    
    try {
      console.log(`🔄 Clonando repositorio ${owner}/${repoName}...`);
      
      // Obtener información del repositorio
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
      if (!repoResponse.ok) {
        throw new Error('Repositorio no encontrado o no es público');
      }
      
      // Obtener la estructura de archivos del repositorio
      const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`);
      const treeData = await treeResponse.json();
      
      if (!treeData.tree) {
        throw new Error('No se pudo obtener la estructura del repositorio');
      }

      // Filtrar solo archivos (no directorios) y limitar a archivos comunes
      const files = treeData.tree.filter((item: any) => 
        item.type === 'blob' && 
        item.size < 100000 && // Limitar tamaño de archivo a 100KB
        /\.(js|ts|tsx|jsx|html|css|md|json|txt|py|java|cpp|c|h)$/i.test(item.path)
      ).slice(0, 20); // Limitar a 20 archivos

      console.log(`📁 Procesando ${files.length} archivos...`);

      // Crear estructura de archivos
      const fileStructure: any[] = [];
      const folderMap: { [key: string]: any } = {};

      for (const file of files) {
        try {
          // Obtener contenido del archivo
          const contentResponse = await fetch(file.url);
          const contentData = await contentResponse.json();
          
          if (contentData.content && contentData.encoding === 'base64') {
            const content = atob(contentData.content);
            const pathParts = file.path.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const fileId = `clone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Crear objeto de archivo
            const fileObj = {
              id: fileId,
              name: fileName,
              type: 'file' as const,
              path: `/${repoName}/${file.path}`,
              extension: fileName.split('.').pop()?.toLowerCase() || 'txt'
            };

            // Guardar contenido del archivo
            await FileSystemManager.saveFileContent(fileId, content);

            // Organizar en carpetas si es necesario
            if (pathParts.length > 1) {
              const folderPath = pathParts.slice(0, -1).join('/');
              if (!folderMap[folderPath]) {
                folderMap[folderPath] = {
                  id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: folderPath.split('/').pop() || folderPath,
                  type: 'folder' as const,
                  path: `/${repoName}/${folderPath}`,
                  children: [],
                  isOpen: true
                };
              }
              folderMap[folderPath].children.push(fileObj);
            } else {
              fileStructure.push(fileObj);
            }
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo cargar el archivo ${file.path}:`, error);
        }
      }

      // Agregar carpetas a la estructura
      Object.values(folderMap).forEach(folder => {
        fileStructure.push(folder);
      });

      // Crear carpeta principal del repositorio
      const mainFolder = {
        id: `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: repoName,
        type: 'folder' as const,
        path: `/${repoName}`,
        children: fileStructure,
        isOpen: true
      };

      // Actualizar la estructura de archivos en la sidebar
      updateFiles([mainFolder]);
      
      Alert.alert(
        '✅ Repositorio Clonado',
        `Se clonaron ${files.length} archivos del repositorio "${repoName}". Los archivos están disponibles en tu proyecto.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRepoUrl('');
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error clonando repositorio:', error);
      Alert.alert('❌ Error', `No se pudo clonar el repositorio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsCloning(false);
    }
  };

  const handleClearUrl = () => {
    setRepoUrl('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Control de Versiones</Text>
        <Text style={styles.headerSubtitle}>Clona un repositorio Git</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="information-outline" size={moderateScale(20)} color={COLOR.primary} />
            <Text style={styles.infoText}>
              Solo repositorios públicos de GitHub. Se clonarán hasta 20 archivos de código (JS, HTML, CSS, etc.)
            </Text>
          </View>
        </View>

        {/* Formulario de clonado */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>URL del Repositorio</Text>
          
          <View style={styles.inputContainer}>
            <Icon name="link" size={moderateScale(18)} color={COLOR.icon} />
            <TextInput
              style={styles.urlInput}
              value={repoUrl}
              onChangeText={setRepoUrl}
              placeholder="https://github.com/usuario/repositorio.git"
              placeholderTextColor={COLOR.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!isCloning}
            />
            {repoUrl.length > 0 && !isCloning && (
              <TouchableOpacity onPress={handleClearUrl}>
                <Icon name="close-circle" size={moderateScale(18)} color={COLOR.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.cloneButton,
              (!repoUrl.trim() || isCloning) && styles.cloneButtonDisabled
            ]}
            onPress={handleCloneRepository}
            disabled={!repoUrl.trim() || isCloning}
          >
            {isCloning ? (
              <>
                <Icon name="loading" size={moderateScale(18)} color={COLOR.background} />
                <Text style={styles.cloneButtonText}>Clonando...</Text>
              </>
            ) : (
              <>
                <Icon name="download" size={moderateScale(18)} color={COLOR.background} />
                <Text style={styles.cloneButtonText}>Clonar Repositorio</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Ejemplos */}
        <View style={styles.examplesSection}>
          <Text style={styles.sectionTitle}>Repositorios de Ejemplo</Text>
          
          <TouchableOpacity 
            style={styles.exampleItem}
            onPress={() => setRepoUrl('https://github.com/microsoft/vscode')}
          >
            <Icon name="github" size={moderateScale(16)} color={COLOR.textSecondary} />
            <Text style={styles.exampleText}>
              https://github.com/microsoft/vscode
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exampleItem}
            onPress={() => setRepoUrl('https://github.com/facebook/react')}
          >
            <Icon name="github" size={moderateScale(16)} color={COLOR.textSecondary} />
            <Text style={styles.exampleText}>
              https://github.com/facebook/react
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exampleItem}
            onPress={() => setRepoUrl('https://github.com/nodejs/node')}
          >
            <Icon name="github" size={moderateScale(16)} color={COLOR.textSecondary} />
            <Text style={styles.exampleText}>
              https://github.com/nodejs/node
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer informativo */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Nota: Solo se pueden clonar repositorios públicos. Para repositorios privados necesitarás configurar autenticación.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
  },
  content: {
    flex: 1,
  },
  infoSection: {
    padding: moderateScale(16),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLOR.surfaceLight,
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    gap: scale(12),
  },
  infoText: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
  },
  formSection: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(24),
  },
  sectionTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: COLOR.border,
    marginBottom: verticalScale(16),
    gap: scale(10),
  },
  urlInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
  },
  cloneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    gap: scale(8),
  },
  cloneButtonDisabled: {
    backgroundColor: COLOR.textSecondary,
  },
  cloneButtonText: {
    color: COLOR.background,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  examplesSection: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(24),
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    gap: scale(10),
  },
  exampleText: {
    flex: 1,
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontFamily: 'monospace',
  },
  footerInfo: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(32),
  },
  footerText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
