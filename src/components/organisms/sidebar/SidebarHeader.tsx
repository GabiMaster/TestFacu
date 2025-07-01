import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
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
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

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
      <View style={getStyles(colors).navigationRow}>
        <TouchableOpacity 
          style={[getStyles(colors).navButton, currentView === 'home' && getStyles(colors).navButtonActive]}
          onPress={handleHomePress}
        >
          <Icon name="home-outline" size={moderateScale(22)} color={currentView === 'home' ? colors.primary : colors.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[getStyles(colors).navButton, currentView === 'files' && getStyles(colors).navButtonActive]}
          onPress={handleFolderPress}
        >
          <Icon name="folder-outline" size={moderateScale(22)} color={currentView === 'files' ? colors.primary : colors.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[getStyles(colors).navButton, currentView === 'search' && getStyles(colors).navButtonActive]}
          onPress={handleSearchPress}
        >
          <Icon name="file-search-outline" size={moderateScale(22)} color={currentView === 'search' ? colors.primary : colors.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[getStyles(colors).navButton, currentView === 'git' && getStyles(colors).navButtonActive]}
          onPress={handleGitPress}
        >
          <Icon name="source-branch" size={moderateScale(22)} color={currentView === 'git' ? colors.primary : colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Header de archivos - solo mostrar en vista de archivos */}
      {currentView === 'files' && (
        <View style={getStyles(colors).header}>
          <View style={getStyles(colors).headerLeft}>
            <Text style={getStyles(colors).headerTitle}>ARCHIVOS</Text>
            {currentFolder && (
              <TouchableOpacity 
                style={getStyles(colors).currentFolderBadge}
                onPress={onClearCurrentFolder}
                activeOpacity={0.7}
              >
                <Text style={getStyles(colors).headerSubtitle}>
                  📁 {currentFolder.name}
                </Text>
                <Icon name="close-circle" size={moderateScale(14)} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={getStyles(colors).headerRight}>
            <TouchableOpacity 
              style={[
                getStyles(colors).headerButton,
                !hasClipboardContent && getStyles(colors).headerButtonDisabled
              ]}
              onPress={hasClipboardContent ? onPaste : undefined}
              disabled={!hasClipboardContent}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon 
                name="content-paste" 
                size={moderateScale(18)} 
                color={hasClipboardContent ? colors.icon : colors.textSecondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={getStyles(colors).headerButton}
              onPress={onNewFile}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="file-plus-outline" size={moderateScale(18)} color={colors.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={getStyles(colors).headerButton}
              onPress={onNewFolder}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="folder-plus-outline" size={moderateScale(18)} color={colors.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={getStyles(colors).headerButton}
              onPress={onImport}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="import" size={moderateScale(18)} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Header para otras vistas */}
      {currentView !== 'files' && (
        <View style={getStyles(colors).header}>
          <View style={getStyles(colors).headerLeft}>
            <Text style={getStyles(colors).headerTitle}>
              {currentView === 'home' && 'HOME'}
              {currentView === 'search' && 'BÚSQUEDA'}
              {currentView === 'git' && 'GIT'}
              {currentView === 'user' && 'USUARIO'}
            </Text>
          </View>
          
          <View style={getStyles(colors).headerRight}>
            <TouchableOpacity 
              style={getStyles(colors).headerButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close" size={moderateScale(18)} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingTop: verticalScale(36),
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textSecondary,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: colors.primary,
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  currentFolderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
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