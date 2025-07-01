import { FileItem } from '@/src/components/molecules/FileItem';
import { COLOR } from '@/src/constants/colors';
import { FileItem as FileItemType } from '@/src/hooks/sidebar/useSidebar';
import React from 'react';
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
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({
  files,
  selectedFile,
  currentFolder,
  onSelectFile,
  onToggleFolder,
  onSetCurrentFolder
}) => {
  console.log('🔧 SidebarBody: Received onSetCurrentFolder:', typeof onSetCurrentFolder);

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
        />
        
        {/* Renderizar hijos si es una carpeta abierta */}
        {file.type === 'folder' && file.isOpen && file.children && (
          <View>
            {renderFileTree(file.children, depth + 1)}
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView 
      style={styles.body}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {renderFileTree(files)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  contentContainer: {
    paddingVertical: verticalScale(8),
  },
});