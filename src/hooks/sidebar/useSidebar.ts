import { useCallback, useState } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  extension?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([
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
  ]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const selectFile = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === folderId 
          ? { ...file, isOpen: !file.isOpen }
          : file
      )
    );
  }, []);

  const createNewFile = useCallback((name: string, parentPath?: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'file',
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      extension: name.split('.').pop()
    };

    if (parentPath) {
      setFiles(prevFiles => 
        prevFiles.map(file => {
          if (file.path === parentPath && file.type === 'folder') {
            return {
              ...file,
              children: [...(file.children || []), newFile]
            };
          }
          return file;
        })
      );
    } else {
      setFiles(prevFiles => [...prevFiles, newFile]);
    }
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prevFiles => 
      prevFiles.filter(file => file.id !== fileId)
        .map(file => ({
          ...file,
          children: file.children?.filter(child => child.id !== fileId)
        }))
    );
  }, []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => {
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
      })
    );
  }, []);

  return {
    isOpen,
    files,
    selectedFile,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    selectFile,
    toggleFolder,
    createNewFile,
    deleteFile,
    renameFile,
  };
};