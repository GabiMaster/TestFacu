import { FileItem, useSidebar } from '@/src/hooks/sidebar/useSidebar';
import React, { createContext, ReactNode, useContext } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  files: FileItem[];
  selectedFile: FileItem | null;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  selectFile: (file: FileItem) => void;
  toggleFolder: (folderId: string) => void;
  createNewFile: (name: string, parentPath?: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
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