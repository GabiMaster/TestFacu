import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useFileSystemInitializer } from '@/src/hooks/fileSystem/useFileSystemInitializer';
import { useSidebar } from '@/src/hooks/sidebar/useSidebar';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FileSystemDemo: React.FC = () => {
  const { 
    createNewFile, 
    createNewFolder, 
    importFile, 
    exportFile, 
    files,
    selectedFile 
  } = useSidebar();
  
  const { initializeWithSampleFiles, isInitializing } = useFileSystemInitializer();
  const { theme } = useTheme();
  const router = useRouter();
  const COLOR = getColorsByTheme(theme);
  const styles = getStyles(COLOR);

  const handleCreateFile = () => {
    Alert.prompt(
      'Crear Archivo',
      'Ingresa el nombre del archivo (con extensión):',
      (fileName) => {
        if (fileName && fileName.trim()) {
          createNewFile(fileName.trim());
          Alert.alert('✅ Éxito', `Archivo "${fileName}" creado`);
        }
      },
      'plain-text',
      'nuevo-archivo.js'
    );
  };

  const handleCreateFolder = () => {
    Alert.prompt(
      'Crear Carpeta',
      'Ingresa el nombre de la carpeta:',
      (folderName) => {
        if (folderName && folderName.trim()) {
          createNewFolder(folderName.trim());
          Alert.alert('✅ Éxito', `Carpeta "${folderName}" creada`);
        }
      },
      'plain-text',
      'nueva-carpeta'
    );
  };

  const handleImportFile = async () => {
    try {
      await importFile();
      Alert.alert('✅ Éxito', 'Archivo importado correctamente');
    } catch {
      Alert.alert('❌ Error', 'No se pudo importar el archivo');
    }
  };

  const handleExportFile = async () => {
    if (!selectedFile) {
      Alert.alert('⚠️ Aviso', 'Selecciona un archivo primero');
      return;
    }

    try {
      await exportFile(selectedFile.id, selectedFile.name);
      Alert.alert('✅ Éxito', 'Archivo exportado correctamente');
    } catch {
      Alert.alert('❌ Error', 'No se pudo exportar el archivo');
    }
  };

  const handleInitializeSamples = async () => {
    await initializeWithSampleFiles();
    Alert.alert('✅ Éxito', 'Archivos de ejemplo inicializados con contenido real');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.rollbackButton} onPress={() => router.replace('/(tabs)/settings')}>
        <Icon name="arrow-left" size={22} color={COLOR.icon} />
      </TouchableOpacity>
      <View style={{ height: 80 }} />
      <Text style={styles.title}>🗂️ Sistema de Archivos Demo</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          📁 Archivos: {files.reduce((count, item) => 
            count + (item.children?.filter(child => child.type === 'file').length || 0)
          , files.filter(f => f.type === 'file').length)}
        </Text>
        <Text style={styles.statsText}>
          📂 Carpetas: {files.reduce((count, item) => 
            count + (item.children?.filter(child => child.type === 'folder').length || 0)
          , files.filter(f => f.type === 'folder').length)}
        </Text>
      </View>

      {selectedFile && (
        <View style={styles.selectedFile}>
          <Text style={styles.selectedText}>
            Seleccionado: {selectedFile.name}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateFile}>
          <Text style={styles.buttonText}>📄 Crear Archivo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateFolder}>
          <Text style={styles.buttonText}>📁 Crear Carpeta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleImportFile}>
          <Text style={styles.buttonText}>📥 Importar Archivo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !selectedFile && styles.buttonDisabled]} 
          onPress={handleExportFile}
          disabled={!selectedFile}
        >
          <Text style={[styles.buttonText, !selectedFile && styles.buttonTextDisabled]}>
            📤 Exportar Archivo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.initButton]} 
          onPress={handleInitializeSamples}
          disabled={isInitializing}
        >
          <Text style={styles.buttonText}>
            {isInitializing ? '⏳ Inicializando...' : '🚀 Inicializar Samples'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>✨ Capacidades del Sistema:</Text>
        <Text style={styles.infoText}>✅ Crear/Eliminar archivos y carpetas</Text>
        <Text style={styles.infoText}>✅ Persistencia con AsyncStorage</Text>
        <Text style={styles.infoText}>✅ Import/Export de archivos reales</Text>
        <Text style={styles.infoText}>✅ Contenido real, no simulación</Text>
        <Text style={styles.infoText}>✅ Estructura jerárquica</Text>
      </View>
    </View>
  );
};

function getStyles(COLOR: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: COLOR.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLOR.textPrimary,
      textAlign: 'center',
      marginBottom: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      padding: 15,
      backgroundColor: COLOR.surface,
      borderRadius: 10,
    },
    statsText: {
      fontSize: 16,
      color: COLOR.textSecondary,
      fontWeight: '600',
    },
    selectedFile: {
      padding: 10,
      backgroundColor: COLOR.primary,
      borderRadius: 8,
      marginBottom: 15,
    },
    selectedText: {
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonContainer: {
      gap: 15,
      marginBottom: 20,
    },
    button: {
      backgroundColor: COLOR.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: COLOR.disabled,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextDisabled: {
      color: COLOR.textSecondary,
    },
    initButton: {
      backgroundColor: COLOR.success,
    },
    infoContainer: {
      backgroundColor: COLOR.surface,
      padding: 15,
      borderRadius: 10,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR.textPrimary,
      marginBottom: 10,
    },
    infoText: {
      fontSize: 14,
      color: COLOR.textSecondary,
      marginBottom: 5,
    },
    rollbackButton: {
      position: 'absolute',
      top: 32,
      left: 20,
      backgroundColor: COLOR.surfaceLight,
      borderRadius: 32,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      zIndex: 10,
    },
  });
}
