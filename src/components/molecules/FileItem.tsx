import { FileIcon } from '@/src/components/atoms/FileIcon';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { FileItem as FileItemType } from '@/src/hooks/sidebar/useSidebar';
import { router } from 'expo-router';
import React from 'react';
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
  depth?: number;
  onSelect: (file: FileItemType) => void;
  onToggleFolder?: (folderId: string) => void;
  onShowOptions?: (file: FileItemType) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected,
  depth = 0,
  onSelect,
  onToggleFolder,
  onShowOptions
}) => {
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
    if (onShowOptions) {
      onShowOptions(file);
    }
  };

  const showContextMenu = () => {
    const options = file.type === 'folder' 
      ? ['Nuevo archivo', 'Nueva carpeta', 'Renombrar', 'Eliminar', 'Cancelar']
      : ['Copiar', 'Renombrar', 'Eliminar', 'Exportar', 'Cancelar'];

    Alert.alert(
      file.name,
      'Selecciona una opción:',
      options.map(option => ({
        text: option,
        style: option === 'Cancelar' ? 'cancel' : 'default',
        onPress: () => {
          if (option !== 'Cancelar') {
            console.log(`${option} - ${file.name}`);
          }
        }
      }))
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.fileItem,
        { paddingLeft: moderateScale(16 + (depth * 12)) },
        isSelected && styles.fileItemSelected
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
            isSelected && styles.fileNameSelected
          ]}
          numberOfLines={1}
        >
          {file.name}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.optionsButton}
        onPress={showContextMenu}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon 
          name="dots-horizontal" 
          size={moderateScale(16)} 
          color={COLOR.textSecondary} 
        />
      </TouchableOpacity>
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
  optionsButton: {
    padding: moderateScale(4),
    borderRadius: moderateScale(4),
  },
});