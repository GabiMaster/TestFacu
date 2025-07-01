import { InputModal } from '@/src/components/molecules/InputModal';
import { COLOR } from '@/src/constants/colors';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SidebarBody } from './SidebarBody';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarHomeView } from './SidebarHomeView';
import { SidebarSearchView } from './SidebarSearchView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const {
    isOpen,
    currentView,
    files,
    selectedFile,
    currentFolder,
    closeSidebar,
    selectFile,
    setCurrentFolder,
    toggleFolder,
    createNewFile,
    createNewFolder,
    copyFile,
    cutFile,
    renameFileOrFolder,
    deleteFileOrFolder,
    importFile,
    pasteFile,
    hasClipboardContent
  } = useSidebarContext();

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Estados para los modales de input
  const [showFileModal, setShowFileModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Animación del sidebar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [isOpen, slideAnim, overlayOpacity]);

  // Contar archivos total
  const getTotalFileCount = (): number => {
    const countFiles = (items: typeof files): number => {
      return items.reduce((count, item) => {
        if (item.type === 'file') {
          return count + 1;
        } else if (item.children) {
          return count + countFiles(item.children);
        }
        return count;
      }, 0);
    };
    return countFiles(files);
  };

  const handleNewFile = () => {
    console.log('🎯 HandleNewFile called - showing modal');
    setShowFileModal(true);
  };

  const handleNewFolder = () => {
    console.log('🎯 HandleNewFolder called - showing modal'); 
    setShowFolderModal(true);
  };

  const handleFileModalConfirm = (fileName: string) => {
    console.log('🎯 File modal confirmed with name:', fileName);
    console.log('📁 Current folder:', currentFolder?.name || 'Root');
    console.log('✅ Creating file...');
    
    // Crear el archivo en la carpeta actual
    const parentPath = currentFolder?.path;
    createNewFile(fileName, parentPath);
    
    // Cerrar modal y sidebar
    setShowFileModal(false);
    closeSidebar();
    
    // Navegar al editor
    router.push('/(editor)/editor');
    
    // Mensaje de éxito
    const location = currentFolder ? `en "${currentFolder.name}"` : 'en la raíz';
    setTimeout(() => {
      Alert.alert('✅ Archivo Creado', `"${fileName}" se creó correctamente ${location} y está listo para editar.`);
    }, 500);
  };

  const handleFolderModalConfirm = (folderName: string) => {
    console.log('🎯 Folder modal confirmed with name:', folderName);
    console.log('📁 Current folder:', currentFolder?.name || 'Root');
    console.log('✅ Creating folder...');
    
    // Crear la carpeta en la carpeta actual
    const parentPath = currentFolder?.path;
    createNewFolder(folderName, parentPath);
    
    // Cerrar modal
    setShowFolderModal(false);
    
    // Mensaje de éxito
    const location = currentFolder ? `en "${currentFolder.name}"` : 'en la raíz';
    Alert.alert('✅ Carpeta Creada', `"${folderName}" se creó correctamente ${location}.`);
  };

  const handleRefresh = () => {
    console.log('Refrescar archivos');
  };

  const handleImport = async () => {
    try {
      console.log('🔄 Importando archivo...');
      await importFile();
      console.log('✅ Archivo importado correctamente');
    } catch (error) {
      console.error('❌ Error al importar archivo:', error);
      Alert.alert('Error', 'No se pudo importar el archivo. Inténtalo de nuevo.');
    }
  };

  const handlePaste = async () => {
    try {
      console.log('📋 Pegando archivo...');
      await pasteFile();
      console.log('✅ Archivo pegado correctamente');
      
      // Mostrar mensaje de éxito
      const location = currentFolder ? `en "${currentFolder.name}"` : 'en la raíz';
      Alert.alert('✅ Pegado', `El elemento se pegó correctamente ${location}.`);
    } catch (error) {
      console.error('❌ Error al pegar archivo:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo pegar el elemento');
    }
  };

  const handleSettings = () => {
    console.log('Configuración del explorador');
  };

  const handleHelp = () => {
    console.log('Ayuda del explorador');
  };

  // Renderizar contenido según la vista actual
  const renderSidebarContent = () => {
    // Removemos el log que se ejecuta en cada render
    switch (currentView) {
      case 'home':
        return <SidebarHomeView onClose={closeSidebar} />;
      
      case 'files':
        return (
          <>
            <SidebarBody
              files={files}
              selectedFile={selectedFile}
              currentFolder={currentFolder}
              onSelectFile={selectFile}
              onToggleFolder={toggleFolder}
              onSetCurrentFolder={setCurrentFolder}
              onCopyFile={copyFile}
              onCutFile={cutFile}
              onRenameFile={renameFileOrFolder}
              onDeleteFile={deleteFileOrFolder}
            />
            <SidebarFooter
              fileCount={getTotalFileCount()}
              onSettings={handleSettings}
              onHelp={handleHelp}
            />
          </>
        );
      
      case 'search':
        return <SidebarSearchView onClose={closeSidebar} />;
      
      case 'git':
        return (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderText}>Control de Versiones</Text>
            <Text style={styles.placeholderSubtext}>Funcionalidad en desarrollo</Text>
          </View>
        );
      
      case 'user':
        return (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderText}>Perfil de Usuario</Text>
            <Text style={styles.placeholderSubtext}>Funcionalidad en desarrollo</Text>
          </View>
        );
      
      default:
        console.log('🔧 Sidebar: Passing setCurrentFolder to SidebarBody:', typeof setCurrentFolder);
        return (
          <SidebarBody
            files={files}
            selectedFile={selectedFile}
            currentFolder={currentFolder}
            onSelectFile={selectFile}
            onToggleFolder={toggleFolder}
            onSetCurrentFolder={setCurrentFolder}
            onCopyFile={copyFile}
            onCutFile={cutFile}
            onRenameFile={renameFileOrFolder}
            onDeleteFile={deleteFileOrFolder}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenido principal */}
      <View style={styles.mainContent}>
        {children}
      </View>

      {/* Overlay */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.overlay,
            { opacity: overlayOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeSidebar}
          />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <SidebarHeader
          onClose={closeSidebar}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onRefresh={handleRefresh}
          onImport={handleImport}
          onPaste={handlePaste}
          hasClipboardContent={hasClipboardContent()}
          currentFolder={currentFolder}
          onClearCurrentFolder={() => setCurrentFolder(null)}
        />
        
        {renderSidebarContent()}
      </Animated.View>

      {/* Modales de input */}
      <InputModal
        visible={showFileModal}
        title="Nuevo Archivo"
        message="Ingresa el nombre del archivo (con extensión):"
        placeholder="mi-archivo.js"
        defaultValue="mi-archivo.js"
        onConfirm={handleFileModalConfirm}
        onCancel={() => setShowFileModal(false)}
      />

      <InputModal
        visible={showFolderModal}
        title="Nueva Carpeta"
        message="Ingresa el nombre de la carpeta:"
        placeholder="mi-carpeta"
        defaultValue="mi-carpeta"
        onConfirm={handleFolderModalConfirm}
        onCancel={() => setShowFolderModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLOR.background,
    borderRightWidth: 1,
    borderRightColor: COLOR.border,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
  placeholderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
  },
  placeholderText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  placeholderSubtext: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});