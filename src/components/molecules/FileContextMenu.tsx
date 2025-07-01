import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface FileContextMenuProps {
  visible: boolean;
  file: FileItem | null;
  onClose: () => void;
  onCopy: (file: FileItem) => void;
  onCut: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
}

interface ContextMenuOption {
  icon: string;
  label: string;
  action: () => void;
  color?: string;
  destructive?: boolean;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  visible,
  file,
  onClose,
  onCopy,
  onCut,
  onRename,
  onDelete,
}) => {
  if (!file) return null;

  const getMenuOptions = (): ContextMenuOption[] => {
    const options: ContextMenuOption[] = [
      {
        icon: 'content-copy',
        label: 'Copiar',
        action: () => {
          console.log('📋 Copying file:', file.name);
          onCopy(file);
          onClose();
        },
      },
      {
        icon: 'content-cut',
        label: 'Cortar',
        action: () => {
          console.log('✂️ Cutting file:', file.name);
          onCut(file);
          onClose();
        },
      },
      {
        icon: 'pencil-outline',
        label: 'Renombrar',
        action: () => {
          console.log('✏️ Renaming file:', file.name);
          onRename(file);
          onClose();
        },
      },
      {
        icon: 'delete-outline',
        label: 'Borrar',
        action: () => {
          console.log('🗑️ Deleting file:', file.name);
          Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de que quieres eliminar "${file.name}"?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                  onDelete(file);
                  onClose();
                },
              },
            ]
          );
        },
        color: COLOR.error,
        destructive: true,
      },
    ];

    return options;
  };

  const renderOption = (option: ContextMenuOption, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.menuOption,
        option.destructive && styles.menuOptionDestructive,
      ]}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <Icon
        name={option.icon}
        size={moderateScale(20)}
        color={option.color || COLOR.textPrimary}
      />
      <Text
        style={[
          styles.menuOptionText,
          option.destructive && styles.menuOptionTextDestructive,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menu}>
          <View style={styles.menuHeader}>
            <Icon
              name={file.type === 'folder' ? 'folder' : 'file-document-outline'}
              size={moderateScale(16)}
              color={COLOR.primary}
            />
            <Text style={styles.menuTitle} numberOfLines={1}>
              {file.name}
            </Text>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuOptions}>
            {getMenuOptions().map(renderOption)}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  menu: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(12),
    minWidth: moderateScale(200),
    maxWidth: moderateScale(280),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    gap: moderateScale(8),
  },
  menuTitle: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLOR.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLOR.border,
    marginHorizontal: moderateScale(8),
  },
  menuOptions: {
    paddingVertical: moderateScale(8),
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    gap: moderateScale(12),
  },
  menuOptionDestructive: {
    backgroundColor: COLOR.error + '10',
  },
  menuOptionText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLOR.textPrimary,
    flex: 1,
  },
  menuOptionTextDestructive: {
    color: COLOR.error,
  },
});
