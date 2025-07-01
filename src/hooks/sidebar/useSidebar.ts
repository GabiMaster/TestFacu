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
  const [currentFolder, setCurrentFolder] = useState<FileItem | null>(null); // Carpeta actual

  // Removed excessive logging that was causing console spam
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
    const initializeFiles = async () => {
      console.log('🔄 Initializing file structure...');
      await loadFileStructure();
    };
    initializeFiles();
  }, []);

  const loadFileStructure = async () => {
    try {
      console.log('📂 Loading file structure from storage...');
      const savedFiles = await FileSystemManager.loadFileStructure();
      console.log('📂 Loaded files:', savedFiles);
      
      if (savedFiles.length > 0) {
        console.log('✅ Setting loaded files to state');
        setFiles(savedFiles);
      } else {
        console.log('⚠️ No saved files found, keeping default structure');
      }
    } catch (error) {
      console.error('❌ Error loading file structure:', error);
    }
  };

  const saveFileStructure = useCallback(async (newFiles: FileItem[]) => {
    try {
      await FileSystemManager.saveFileStructure(newFiles);
    } catch (error) {
      console.error('Error saving file structure:', error);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    console.log('🔧 useSidebar: openSidebar called, setting isOpen to true');
    setIsOpen(true);
    console.log('✅ useSidebar: openSidebar completed');
  }, []);

  const changeView = useCallback((view: SidebarView) => {
    console.log('🔧 useSidebar: changeView called with:', view);
    setCurrentView(view);
    console.log('✅ useSidebar: changeView completed, new view:', view);
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
  }, [saveFileStructure]);

  const createNewFile = useCallback((name: string, parentPath?: string) => {
    console.log('🔧 Creating new file:', { name, parentPath });
    
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'file',
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      extension: name.split('.').pop()
    };

    console.log('📄 New file object:', newFile);

    setFiles(prevFiles => {
      console.log('📁 Current files before creation:', prevFiles.length, 'files');
      console.log('📁 Current files names:', prevFiles.map(f => f.name));
      
      let newFiles: FileItem[];
      
      if (parentPath) {
        newFiles = prevFiles.map(file => {
          if (file.path === parentPath && file.type === 'folder') {
            console.log('📂 Adding file to folder:', file.name);
            return {
              ...file,
              children: [...(file.children || []), newFile]
            };
          }
          return file;
        });
      } else {
        console.log('📄 Adding file to root');
        newFiles = [...prevFiles, newFile];
      }
      
      console.log('📁 New files after creation:', newFiles.length, 'files');
      console.log('📁 New files names:', newFiles.map(f => f.name));
      console.log('📋 Files structure:', newFiles.map(f => ({ 
        name: f.name, 
        type: f.type, 
        children: f.children?.length || 0,
        id: f.id 
      })));
      
      // Guardar de forma asíncrona sin bloquear el setFiles
      setTimeout(() => {
        saveFileStructure(newFiles);
      }, 0);
      
      return newFiles;
    });
  }, [saveFileStructure]);

  const createNewFolder = useCallback((name: string, parentPath?: string) => {
    console.log('🔧 Creating new folder:', { name, parentPath });
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      children: [],
      isOpen: false
    };

    console.log('📂 New folder object:', newFolder);

    setFiles(prevFiles => {
      console.log('📁 Current files before creation:', prevFiles.length, 'files');
      console.log('📁 Current files names:', prevFiles.map(f => f.name));
      
      let newFiles: FileItem[];
      
      if (parentPath) {
        newFiles = prevFiles.map(file => {
          if (file.path === parentPath && file.type === 'folder') {
            console.log('📂 Adding folder to parent folder:', file.name);
            return {
              ...file,
              children: [...(file.children || []), newFolder]
            };
          }
          return file;
        });
      } else {
        console.log('📂 Adding folder to root');
        newFiles = [...prevFiles, newFolder];
      }
      
      console.log('📁 New files after creation:', newFiles.length, 'files');
      console.log('📁 New files names:', newFiles.map(f => f.name));
      console.log('📋 Files structure:', newFiles.map(f => ({ 
        name: f.name, 
        type: f.type, 
        children: f.children?.length || 0,
        id: f.id 
      })));
      
      // Guardar de forma asíncrona sin bloquear el setFiles
      setTimeout(() => {
        saveFileStructure(newFiles);
      }, 0);
      
      return newFiles;
    });
  }, [saveFileStructure]);

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
  }, [saveFileStructure]);

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
  }, [saveFileStructure]);

  const importFile = useCallback(async () => {
    try {
      console.log('📁 Starting file import...');
      const result = await FileSystemManager.importFile();
      
      if (result) {
        console.log('✅ File imported successfully:', result.name);
        
        // Generar ID único para el archivo
        const newFileId = Date.now().toString();
        
        // Obtener la ruta padre basada en la carpeta actual
        const parentPath = currentFolder?.path;
        
        // Crear el archivo con el contenido
        setFiles(prevFiles => {
          const newFile: FileItem = {
            id: newFileId,
            name: result.name,
            type: 'file',
            path: parentPath ? `${parentPath}/${result.name}` : `/${result.name}`,
            extension: result.extension
          };

          console.log('📄 Creating new file:', newFile);
          
          let newFiles: FileItem[];
          
          if (parentPath) {
            // Agregar a la carpeta actual
            newFiles = prevFiles.map(file => {
              if (file.path === parentPath && file.type === 'folder') {
                console.log('📂 Adding file to folder:', file.name);
                return {
                  ...file,
                  children: [...(file.children || []), newFile]
                };
              }
              return file;
            });
          } else {
            // Agregar a la raíz
            console.log('📂 Adding file to root');
            newFiles = [...prevFiles, newFile];
          }
          
          // Guardar estructura de archivos
          setTimeout(() => {
            saveFileStructure(newFiles);
          }, 0);
          
          return newFiles;
        });
        
        // Guardar el contenido del archivo
        await FileSystemManager.saveFileContent(newFileId, result.content);
        
        console.log('✅ File import completed successfully');
      } else {
        console.log('❌ File import cancelled or failed');
      }
    } catch (error) {
      console.error('❌ Error importing file:', error);
      throw error;
    }
  }, [currentFolder, saveFileStructure]);

  const exportFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      const content = await FileSystemManager.loadFileContent(fileId);
      await FileSystemManager.exportFile(fileName, content);
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  }, []);

  // ==================== CONTEXT MENU OPERATIONS ====================

  const copyFile = useCallback((file: FileItem) => {
    console.log('📋 Copying file:', file.name);
    FileSystemManager.copyToClipboard(file);
  }, []);

  const cutFile = useCallback((file: FileItem) => {
    console.log('✂️ Cutting file:', file.name);
    FileSystemManager.cutToClipboard(file);
  }, []);

  const renameFileOrFolder = useCallback(async (file: FileItem, newName: string) => {
    try {
      console.log('✏️ Renaming file/folder:', file.name, 'to:', newName);
      const updatedFiles = await FileSystemManager.renameFileOrFolder(files, file.id, newName);
      setFiles(updatedFiles);
      
      // Si es el archivo seleccionado, actualizarlo
      if (selectedFile?.id === file.id) {
        setSelectedFile({ ...file, name: newName });
      }
    } catch (error) {
      console.error('❌ Error renaming file/folder:', error);
      throw error;
    }
  }, [files, selectedFile]);

  const deleteFileOrFolder = useCallback(async (file: FileItem) => {
    try {
      console.log('🗑️ Deleting file/folder:', file.name);
      const updatedFiles = await FileSystemManager.deleteFileOrFolder(files, file.id);
      setFiles(updatedFiles);
      
      // Si es el archivo seleccionado, quitarlo
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      
      // Si es la carpeta actual, quitarla
      if (currentFolder?.id === file.id) {
        setCurrentFolder(null);
      }
    } catch (error) {
      console.error('❌ Error deleting file/folder:', error);
      throw error;
    }
  }, [files, selectedFile, currentFolder]);

  // ==================== CLIPBOARD OPERATIONS ====================

  const pasteFile = useCallback(async () => {
    try {
      console.log('📋 Pasting file...');
      const targetPath = currentFolder?.path || '/';
      const updatedFiles = await FileSystemManager.pasteFromClipboard(files, targetPath);
      setFiles(updatedFiles);
      await saveFileStructure(updatedFiles);
    } catch (error) {
      console.error('❌ Error pasting file:', error);
      throw error;
    }
  }, [files, currentFolder, saveFileStructure]);

  const hasClipboardContent = useCallback((): boolean => {
    return FileSystemManager.hasClipboardContent();
  }, []);

  // ==================== PROGRAMMATIC FILE UPDATES ====================

  const updateFiles = useCallback((newFiles: FileItem[]) => {
    console.log('🔄 Updating files programmatically:', newFiles.length, 'files');
    setFiles(newFiles);
    saveFileStructure(newFiles);
  }, [saveFileStructure]);

  // ==================== EXISTING OPERATIONS ====================

  return {
    isOpen,
    currentView,
    files,
    selectedFile,
    currentFolder,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    changeView,
    selectFile,
    setCurrentFolder,
    toggleFolder,
    createNewFile,
    createNewFolder,
    deleteFile,
    renameFile,
    importFile,
    exportFile,
    loadFileStructure,
    copyFile,
    cutFile,
    renameFileOrFolder,
    deleteFileOrFolder,
    pasteFile,
    hasClipboardContent,
    updateFiles,
  };
};