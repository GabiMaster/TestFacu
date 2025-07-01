import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileItem } from '../molecules/FileItem';
import { FileItem as FileItemType } from '@/src/hooks/sidebar/useSidebar';
import { COLOR } from '@/src/constants/colors';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export const ContextMenuDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItemType | null>(null);

  const demoFiles: FileItemType[] = [
    {
      id: '1',
      name: 'app.js',
      type: 'file',
      path: '/app.js',
      extension: 'js'
    },
    {
      id: '2',
      name: 'styles.css',
      type: 'file',
      path: '/styles.css',
      extension: 'css'
    },
    {
      id: '3',
      name: 'components',
      type: 'folder',
      path: '/components',
      children: []
    }
  ];

  const handleSelect = (file: FileItemType) => {
    setSelectedFile(file);
    console.log('📁 Selected file:', file.name);
  };

  const handleCopy = (file: FileItemType) => {
    console.log('📋 Copy file:', file.name);
  };

  const handleCut = (file: FileItemType) => {
    console.log('✂️ Cut file:', file.name);
  };

  const handleRename = (file: FileItemType) => {
    console.log('✏️ Rename file:', file.name);
  };

  const handleDelete = (file: FileItemType) => {
    console.log('🗑️ Delete file:', file.name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Context Menu Demo</Text>
      <Text style={styles.subtitle}>Haz clic en los 3 puntos para ver el menú contextual</Text>
      
      <View style={styles.fileList}>
        {demoFiles.map(file => (
          <FileItem
            key={file.id}
            file={file}
            isSelected={selectedFile?.id === file.id}
            onSelect={handleSelect}
            onCopy={handleCopy}
            onCut={handleCut}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </View>
      
      {selectedFile && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Archivo seleccionado: {selectedFile.name}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: COLOR.background,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLOR.textPrimary,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: COLOR.textSecondary,
    marginBottom: verticalScale(20),
  },
  fileList: {
    flex: 1,
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
  },
  selectedInfo: {
    marginTop: verticalScale(20),
    padding: moderateScale(16),
    backgroundColor: COLOR.primary + '20',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: COLOR.primary,
  },
  selectedText: {
    color: COLOR.primary,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});
