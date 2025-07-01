import { FileItem } from '@/src/components/molecules/FileItem';
import { InputModal } from '@/src/components/molecules/InputModal';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { FileItem as FileItemType } from '@/src/hooks/sidebar/useSidebar';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { verticalScale } from 'react-native-size-matters';

interface SidebarBodyProps {
  files: FileItemType[];
  selectedFile: FileItemType | null;
  currentFolder: FileItemType | null;
  onSelectFile: (file: FileItemType) => void;
  onToggleFolder: (folderId: string) => void;
  onSetCurrentFolder: (folder: FileItemType | null) => void;
  onCopyFile: (file: FileItemType) => void;
  onCutFile: (file: FileItemType) => void;
  onRenameFile: (file: FileItemType, newName: string) => Promise<void>;
  onDeleteFile: (file: FileItemType) => Promise<void>;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({
  files,
  selectedFile,
  currentFolder,
  onSelectFile,
  onToggleFolder,
  onSetCurrentFolder,
  onCopyFile,
  onCutFile,
  onRenameFile,
  onDeleteFile
}) => {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);
  
  // Removemos el log que se ejecuta en cada render

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileItemType | null>(null);

  const handleCopy = (file: FileItemType) => {
    console.log('📋 SidebarBody: Copy file:', file.name);
    onCopyFile(file);
  };

  const handleCut = (file: FileItemType) => {
    console.log('✂️ SidebarBody: Cut file:', file.name);
    onCutFile(file);
  };

  const handleRename = (file: FileItemType) => {
    console.log('✏️ SidebarBody: Rename file:', file.name);
    setFileToRename(file);
    setRenameModalVisible(true);
  };

  const handleDelete = async (file: FileItemType) => {
    console.log('🗑️ SidebarBody: Delete file:', file.name);
    try {
      await onDeleteFile(file);
    } catch (error) {
      console.error('❌ Error deleting file:', error);
    }
  };

  const handleRenameConfirm = async (newName: string) => {
    if (fileToRename && newName.trim()) {
      try {
        await onRenameFile(fileToRename, newName.trim());
        setRenameModalVisible(false);
        setFileToRename(null);
      } catch (error) {
        console.error('❌ Error renaming file:', error);
      }
    }
  };

  const handleRenameCancel = () => {
    setRenameModalVisible(false);
    setFileToRename(null);
  };

  const renderFileTree = (items: FileItemType[], depth = 0): React.ReactNode => {
    return items.map(file => (
      <View key={file.id}>
        <FileItem
          file={file}
          isSelected={selectedFile?.id === file.id}
          isCurrentFolder={currentFolder?.id === file.id}
          depth={depth}
          onSelect={onSelectFile}
          onToggleFolder={onToggleFolder}
          onSetCurrentFolder={onSetCurrentFolder}
          onCopy={handleCopy}
          onCut={handleCut}
          onRename={handleRename}
          onDelete={handleDelete}
        />
        
        {/* Renderizar hijos si es una carpeta abierta */}
        {file.type === 'folder' && file.isOpen && file.children && (
          <View>
            {renderFileTree(file.children, depth + 1)}
          </View>
        )}
      </View>
    ));
  };    return (
      <>
        <ScrollView 
          style={getStyles(colors).body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={getStyles(colors).contentContainer}
        >
          {renderFileTree(files)}
        </ScrollView>

        <InputModal
          visible={renameModalVisible}
          title="Renombrar"
          message="Ingresa el nuevo nombre:"
          placeholder="Nuevo nombre"
          defaultValue={fileToRename?.name || ''}
          onConfirm={handleRenameConfirm}
          onCancel={handleRenameCancel}
        />
      </>
    );
  };

  const getStyles = (colors: any) => StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingVertical: verticalScale(8),
    },
  });