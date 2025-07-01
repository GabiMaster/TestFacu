import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

interface FileIconProps {
  extension?: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
  size?: number;
}

export const FileIcon: React.FC<FileIconProps> = ({ 
  extension, 
  type, 
  isOpen = false, 
  size = moderateScale(16) 
}) => {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

  if (type === 'folder') {
    return (
      <Icon 
        name={isOpen ? 'folder-open-outline' : 'folder-outline'} 
        size={size} 
        color={colors.primary} 
      />
    );
  }

  // Iconos por tipo de archivo
  const getFileIcon = () => {
    switch (extension?.toLowerCase()) {
      case 'js':
        return { name: 'language-javascript', color: '#F7DF1E' };
      case 'html':
        return { name: 'language-html5', color: '#E34F26' };
      case 'css':
        return { name: 'language-css3', color: '#1572B6' };
      case 'md':
        return { name: 'language-markdown', color: colors.textSecondary };
      case 'json':
        return { name: 'code-json', color: '#FFA500' };
      case 'py':
        return { name: 'language-python', color: '#3776AB' };
      case 'java':
        return { name: 'language-java', color: '#ED8B00' };
      default:
        return { name: 'file-document-outline', color: colors.textSecondary };
    }
  };

  const iconConfig = getFileIcon();
  
  return (
    <Icon 
      name={iconConfig.name} 
      size={size} 
      color={iconConfig.color} 
    />
  );
};