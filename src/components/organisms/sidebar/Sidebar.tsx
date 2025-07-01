import { COLOR } from '@/src/constants/colors';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import React, { useEffect, useRef } from 'react';
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
    closeSidebar,
    selectFile,
    toggleFolder,
    createNewFile
  } = useSidebarContext();

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

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
    Alert.prompt(
      'Nuevo Archivo',
      'Ingresa el nombre del archivo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear',
          onPress: (fileName) => {
            if (fileName?.trim()) {
              createNewFile(fileName.trim(), '/starter-project');
            }
          }
        }
      ],
      'plain-text',
      'nuevo-archivo.txt'
    );
  };

  const handleNewFolder = () => {
    Alert.prompt(
      'Nueva Carpeta',
      'Ingresa el nombre de la carpeta:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear',
          onPress: (folderName) => {
            if (folderName?.trim()) {
              console.log('Crear carpeta:', folderName);
            }
          }
        }
      ],
      'plain-text',
      'nueva-carpeta'
    );
  };

  const handleRefresh = () => {
    console.log('Refrescar archivos');
  };

  const handleSettings = () => {
    console.log('Configuración del explorador');
  };

  const handleHelp = () => {
    console.log('Ayuda del explorador');
  };

  // Renderizar contenido según la vista actual
  const renderSidebarContent = () => {
    switch (currentView) {
      case 'home':
        return <SidebarHomeView onClose={closeSidebar} />;
      
      case 'files':
        return (
          <>
            <SidebarBody
              files={files}
              selectedFile={selectedFile}
              onSelectFile={selectFile}
              onToggleFolder={toggleFolder}
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
        return (
          <SidebarBody
            files={files}
            selectedFile={selectedFile}
            onSelectFile={selectFile}
            onToggleFolder={toggleFolder}
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
        />
        
        {renderSidebarContent()}
      </Animated.View>
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