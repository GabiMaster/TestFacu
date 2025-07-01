import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SidebarHeaderProps {
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
  onImport: () => void;
  onPaste: () => void;
  hasClipboardContent: boolean;
  currentFolder?: FileItem | null;
  onClearCurrentFolder?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onClose,
  onNewFile,
  onNewFolder,
  onRefresh,
  onImport,
  onPaste,
  hasClipboardContent,
  currentFolder,
  onClearCurrentFolder
}) => {
  const { currentView, changeView } = useSidebarContext();

  const handleHomePress = () => {
    changeView('home');
  };

  const handleFolderPress = () => {
    changeView('files');
  };

  const handleSearchPress = () => {
    changeView('search');
  };

  const handleGitPress = () => {
    changeView('git');
  };

  return (
    <View>
      {/* Fila de navegación superior */}
      <View style={styles.navigationRow}>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'home' && styles.navButtonActive]}
          onPress={handleHomePress}
        >
          <Icon name="home-outline" size={moderateScale(22)} color={currentView === 'home' ? COLOR.primary : COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'files' && styles.navButtonActive]}
          onPress={handleFolderPress}
        >
          <Icon name="folder-outline" size={moderateScale(22)} color={currentView === 'files' ? COLOR.primary : COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'search' && styles.navButtonActive]}
          onPress={handleSearchPress}
        >
          <Icon name="file-search-outline" size={moderateScale(22)} color={currentView === 'search' ? COLOR.primary : COLOR.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'git' && styles.navButtonActive]}
          onPress={handleGitPress}
        >
          <Icon name="source-branch" size={moderateScale(22)} color={currentView === 'git' ? COLOR.primary : COLOR.icon} />
        </TouchableOpacity>
      </View>

      {/* Header de archivos - solo mostrar en vista de archivos */}
      {currentView === 'files' && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>ARCHIVOS</Text>
            {currentFolder && (
              <TouchableOpacity 
                style={styles.currentFolderBadge}
                onPress={onClearCurrentFolder}
                activeOpacity={0.7}
              >
                <Text style={styles.headerSubtitle}>
                  📁 {currentFolder.name}
                </Text>
                <Icon name="close-circle" size={moderateScale(14)} color={COLOR.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[
                styles.headerButton,
                !hasClipboardContent && styles.headerButtonDisabled
              ]}
              onPress={hasClipboardContent ? onPaste : undefined}
              disabled={!hasClipboardContent}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon 
                name="content-paste" 
                size={moderateScale(18)} 
                color={hasClipboardContent ? COLOR.icon : COLOR.textSecondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onNewFile}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="file-plus-outline" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onNewFolder}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="folder-plus-outline" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onImport}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="import" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Header para otras vistas */}
      {currentView !== 'files' && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {currentView === 'home' && 'HOME'}
              {currentView === 'search' && 'BÚSQUEDA'}
              {currentView === 'git' && 'GIT'}
              {currentView === 'user' && 'USUARIO'}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingTop: verticalScale(36),
    backgroundColor: COLOR.background,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(4),
    minWidth: moderateScale(40),
  },
  navButtonActive: {
    backgroundColor: COLOR.surface,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: COLOR.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: COLOR.primary,
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  currentFolderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.primary + '15',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    marginTop: verticalScale(4),
    gap: scale(4),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  headerButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
});