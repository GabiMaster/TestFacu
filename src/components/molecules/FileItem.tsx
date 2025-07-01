import { FileIcon } from '@/src/components/atoms/FileIcon';
import { FileContextMenu } from '@/src/components/molecules/FileContextMenu';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { FileItem as FileItemType } from '@/src/hooks/sidebar/useSidebar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface FileItemProps {
  file: FileItemType;
  isSelected: boolean;
  isCurrentFolder?: boolean;
  depth?: number;
  onSelect: (file: FileItemType) => void;
  onToggleFolder?: (folderId: string) => void;
  onSetCurrentFolder?: (folder: FileItemType | null) => void;
  onShowOptions?: (file: FileItemType) => void;
  onCopy?: (file: FileItemType) => void;
  onCut?: (file: FileItemType) => void;
  onRename?: (file: FileItemType) => void;
  onDelete?: (file: FileItemType) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected,
  isCurrentFolder = false,
  depth = 0,
  onSelect,
  onToggleFolder,
  onSetCurrentFolder,
  onShowOptions,
  onCopy,
  onCut,
  onRename,
  onDelete,
}) => {
  const [showContextMenuModal, setShowContextMenuModal] = useState(false);

  const handlePress = () => {
    if (file.type === 'folder' && onToggleFolder) {
      onToggleFolder(file.id);
    } else {
      // Seleccionar archivo y navegar al editor
      onSelect(file);
      router.push('/(editor)/editor');
    }
  };

  const handleLongPress = () => {
    console.log('🔥 Long press detected on:', file.name, 'type:', file.type);
    console.log('🔥 onSetCurrentFolder available:', !!onSetCurrentFolder);
    console.log('🔥 onSetCurrentFolder type:', typeof onSetCurrentFolder);
    console.log('🔥 isCurrentFolder:', isCurrentFolder);
    
    if (file.type === 'folder' && onSetCurrentFolder && typeof onSetCurrentFolder === 'function') {
      console.log('✅ Processing folder long press');
      try {
        // Si ya es la carpeta actual, quitarla
        if (isCurrentFolder) {
          console.log('🔄 Clearing current folder');
          onSetCurrentFolder(null);
          Alert.alert('📂 Carpeta', 'Se quitó la selección de carpeta activa. Los nuevos archivos se crearán en la raíz.');
        } else {
          console.log('🎯 Setting as current folder');
          // Establecer como carpeta actual
          onSetCurrentFolder(file);
          Alert.alert('📂 Carpeta activa', `"${file.name}" es ahora la carpeta activa. Los nuevos archivos se crearán aquí.`);
        }
      } catch (error) {
        console.error('❌ Error calling onSetCurrentFolder:', error);
      }
    } else if (onShowOptions) {
      console.log('📝 Showing options menu');
      onShowOptions(file);
    } else {
      console.log('❌ No action available for long press');
    }
  };

  const handleShowContextMenu = () => {
    setShowContextMenuModal(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenuModal(false);
  };

  const handleCopy = (fileItem: FileItemType) => {
    console.log('📋 Copy action for:', fileItem.name);
    if (onCopy) {
      onCopy(fileItem);
    }
  };

  const handleCut = (fileItem: FileItemType) => {
    console.log('✂️ Cut action for:', fileItem.name);
    if (onCut) {
      onCut(fileItem);
    }
  };

  const handleRename = (fileItem: FileItemType) => {
    console.log('✏️ Rename action for:', fileItem.name);
    if (onRename) {
      onRename(fileItem);
    }
  };

  const handleDelete = (fileItem: FileItemType) => {
    console.log('🗑️ Delete action for:', fileItem.name);
    if (onDelete) {
      onDelete(fileItem);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.fileItem,
        { paddingLeft: moderateScale(16 + (depth * 12)) },
        isSelected && styles.fileItemSelected,
        isCurrentFolder && styles.fileItemCurrentFolder
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.fileContent}>
        <FileIcon 
          type={file.type}
          extension={file.extension}
          isOpen={file.isOpen}
          size={moderateScale(16)}
        />
        <Text 
          style={[
            styles.fileName,
            isSelected && styles.fileNameSelected,
            isCurrentFolder && styles.fileNameCurrentFolder
          ]}
          numberOfLines={1}
        >
          {file.name}
        </Text>
        
        {/* Indicador de carpeta actual */}
        {isCurrentFolder && (
          <View style={styles.currentFolderIndicator}>
            <Icon name="target" size={moderateScale(12)} color={COLOR.primary} />
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.optionsButton}
        onPress={handleShowContextMenu}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon 
          name="dots-horizontal" 
          size={moderateScale(16)} 
          color={COLOR.textSecondary} 
        />
      </TouchableOpacity>

      <FileContextMenu
        visible={showContextMenuModal}
        file={file}
        onClose={handleCloseContextMenu}
        onCopy={handleCopy}
        onCut={handleCut}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    paddingRight: moderateScale(12),
    minHeight: moderateScale(32),
  },
  fileItemSelected: {
    backgroundColor: COLOR.primary + '15',
    borderLeftWidth: 2,
    borderLeftColor: COLOR.primary,
  },
  fileItemCurrentFolder: {
    backgroundColor: COLOR.primary + '10',
    borderRightWidth: 3,
    borderRightColor: COLOR.primary,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(8),
  },
  fileName: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: '400',
    flex: 1,
  },
  fileNameSelected: {
    color: COLOR.primary,
    fontWeight: '500',
  },
  fileNameCurrentFolder: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  currentFolderIndicator: {
    marginLeft: scale(4),
    padding: moderateScale(2),
    borderRadius: moderateScale(4),
    backgroundColor: COLOR.primary + '20',
  },
  optionsButton: {
    padding: moderateScale(4),
    borderRadius: moderateScale(4),
  },
});