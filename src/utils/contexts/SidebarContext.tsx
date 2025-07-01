import { FileItem, SidebarView, useSidebar } from '@/src/hooks/sidebar/useSidebar';
import React, { createContext, ReactNode, useContext } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  currentView: SidebarView;
  files: FileItem[];
  selectedFile: FileItem | null;
  currentFolder: FileItem | null; // Carpeta actual donde se crearán nuevos archivos
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  changeView: (view: SidebarView) => void;
  selectFile: (file: FileItem) => void;
  toggleFolder: (folderId: string) => void;
  setCurrentFolder: (folder: FileItem | null) => void; // Establecer carpeta actual
  createNewFile: (name: string, parentPath?: string) => void;
  createNewFolder: (name: string, parentPath?: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  importFile: () => Promise<void>;
  exportFile: (fileId: string, fileName: string) => Promise<void>;
  // Nuevas funciones de menú contextual
  copyFile: (file: FileItem) => void;
  cutFile: (file: FileItem) => void;
  renameFileOrFolder: (file: FileItem, newName: string) => Promise<void>;
  deleteFileOrFolder: (file: FileItem) => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const sidebarState = useSidebar();

  return (
    <SidebarContext.Provider value={sidebarState}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};