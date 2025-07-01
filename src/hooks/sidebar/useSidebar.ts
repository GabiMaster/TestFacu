import { FileSystemManager } from '@/src/utils/fileSystem/FileSystemManager';
import { useCallback, useEffect, useState } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  extension?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

export type SidebarView = 'files' | 'home' | 'search' | 'git' | 'user';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SidebarView>('files');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>(
    [
      {
        id: '1',
        name: 'Starter Project',
        type: 'folder',
        path: '/starter-project',
        isOpen: true,
        children: [
          {
            id: '2',
            name: 'game.js',
            type: 'file',
            path: '/starter-project/game.js',
            extension: 'js'
          },
          {
            id: '3',
            name: 'index.html',
            type: 'file',
            path: '/starter-project/index.html',
            extension: 'html'
          },
          {
            id: '4',
            name: 'README.md',
            type: 'file',
            path: '/starter-project/README.md',
            extension: 'md'
          },
          {
            id: '5',
            name: 'style.css',
            type: 'file',
            path: '/starter-project/style.css',
            extension: 'css'
          }
        ]
      }
    ]
  );

  // Cargar archivos al inicializar
  useEffect(() => {
    loadFileStructure();
  }, []);

  const loadFileStructure = async () => {
    try {
      const savedFiles = await FileSystemManager.loadFileStructure();
      if (savedFiles.length > 0) {
        setFiles(savedFiles);
      }
    } catch (error) {
      console.error('Error loading file structure:', error);
    }
  };

  const saveFileStructure = async (newFiles: FileItem[]) => {
    try {
      await FileSystemManager.saveFileStructure(newFiles);
    } catch (error) {
      console.error('Error saving file structure:', error);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const changeView = useCallback((view: SidebarView) => {
    setCurrentView(view);
  }, []);

  const selectFile = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.map(file => 
        file.id === folderId 
          ? { ...file, isOpen: !file.isOpen }
          : file
      );
      saveFileStructure(newFiles);
      return newFiles;
    });
  }, []);

  const createNewFile = useCallback((name: string, parentPath?: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'file',
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      extension: name.split('.').pop()
    };

    setFiles(prevFiles => {
      let newFiles: FileItem[];
      
      if (parentPath) {
        newFiles = prevFiles.map(file => {
          if (file.path === parentPath && file.type === 'folder') {
            return {
              ...file,
              children: [...(file.children || []), newFile]
            };
          }
          return file;
        });
      } else {
        newFiles = [...prevFiles, newFile];
      }
      
      saveFileStructure(newFiles);
      return newFiles;
    });
  }, []);

  const createNewFolder = useCallback((name: string, parentPath?: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      children: [],
      isOpen: false
    };

    setFiles(prevFiles => {
      let newFiles: FileItem[];
      
      if (parentPath) {
        newFiles = prevFiles.map(file => {
          if (file.path === parentPath && file.type === 'folder') {
            return {
              ...file,
              children: [...(file.children || []), newFolder]
            };
          }
          return file;
        });
      } else {
        newFiles = [...prevFiles, newFolder];
      }
      
      saveFileStructure(newFiles);
      return newFiles;
    });
  }, []);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await FileSystemManager.deleteFile(fileId);
      
      setFiles(prevFiles => {
        const newFiles = prevFiles.filter(file => file.id !== fileId)
          .map(file => ({
            ...file,
            children: file.children?.filter(child => child.id !== fileId)
          }));
        saveFileStructure(newFiles);
        return newFiles;
      });
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.map(file => {
        if (file.id === fileId) {
          return { ...file, name: newName };
        }
        if (file.children) {
          return {
            ...file,
            children: file.children.map(child => 
              child.id === fileId ? { ...child, name: newName } : child
            )
          };
        }
        return file;
      });
      saveFileStructure(newFiles);
      return newFiles;
    });
  }, []);

  const importFile = useCallback(async () => {
    try {
      const result = await FileSystemManager.importFile();
      if (result) {
        createNewFile(result.name);
        // Guardar contenido del archivo
        const newFileId = Date.now().toString();
        await FileSystemManager.saveFileContent(newFileId, result.content);
      }
    } catch (error) {
      console.error('Error importing file:', error);
    }
  }, [createNewFile]);

  const exportFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      const content = await FileSystemManager.loadFileContent(fileId);
      await FileSystemManager.exportFile(fileName, content);
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  }, []);

  return {
    isOpen,
    currentView,
    files,
    selectedFile,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    changeView,
    selectFile,
    toggleFolder,
    createNewFile,
    createNewFolder,
    deleteFile,
    renameFile,
    importFile,
    exportFile,
    loadFileStructure,
  };
};