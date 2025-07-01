import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface FileContent {
  id: string;
  content: string;
  lastModified: number;
}

export class FileSystemManager {
  private static readonly STORAGE_KEYS = {
    FILES_STRUCTURE: 'files_structure',
    FILE_CONTENT: 'file_content_',
    PROJECT_LIST: 'project_list'
  };

  // ==================== CRUD OPERATIONS ====================
  
  static async saveFileStructure(files: FileItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.FILES_STRUCTURE, 
        JSON.stringify(files)
      );
    } catch (error) {
      console.error('❌ Error saving file structure:', error);
      throw new Error('No se pudo guardar la estructura de archivos');
    }
  }

  static async loadFileStructure(): Promise<FileItem[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.FILES_STRUCTURE);
      
      if (stored) {
        const files = JSON.parse(stored);
        return files;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error loading file structure:', error);
      return [];
    }
  }

  /**
   * Guarda el contenido de un archivo
   */
  static async saveFileContent(fileId: string, content: string): Promise<void> {
    try {
      const fileContent: FileContent = {
        id: fileId,
        content,
        lastModified: Date.now()
      };
      
      await AsyncStorage.setItem(
        `${this.STORAGE_KEYS.FILE_CONTENT}${fileId}`,
        JSON.stringify(fileContent)
      );
    } catch (error) {
      console.error('Error saving file content:', error);
      throw new Error('No se pudo guardar el archivo');
    }
  }

  /**
   * Carga el contenido de un archivo
   */
  static async loadFileContent(fileId: string): Promise<string> {
    try {
      const stored = await AsyncStorage.getItem(`${this.STORAGE_KEYS.FILE_CONTENT}${fileId}`);
      if (stored) {
        const fileContent: FileContent = JSON.parse(stored);
        return fileContent.content;
      }
      return '';
    } catch (error) {
      console.error('Error loading file content:', error);
      return '';
    }
  }

  /**
   * Elimina un archivo y su contenido
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.STORAGE_KEYS.FILE_CONTENT}${fileId}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('No se pudo eliminar el archivo');
    }
  }

  // ==================== IMPORT/EXPORT ====================

  /**
   * Importar archivo desde el dispositivo
   */
  static async importFile(): Promise<{ name: string; content: string; extension: string } | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/javascript', 'text/html', 'text/css', '*/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const content = await FileSystem.readAsStringAsync(asset.uri);
        
        return {
          name: asset.name,
          content,
          extension: asset.name.split('.').pop() || 'txt'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error importing file:', error);
      throw new Error('No se pudo importar el archivo');
    }
  }

  /**
   * Exportar archivo
   */
  static async exportFile(fileName: string, content: string): Promise<void> {
    try {
      // Crear archivo temporal
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      // Compartir archivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: this.getMimeType(fileName),
          dialogTitle: `Exportar ${fileName}`
        });
      } else {
        throw new Error('Compartir no está disponible en este dispositivo');
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      throw new Error('No se pudo exportar el archivo');
    }
  }

  /**
   * Exportar proyecto completo como ZIP
   */
  static async exportProject(projectName: string, files: FileItem[]): Promise<void> {
    try {
      // Crear estructura del proyecto en texto
      let projectContent = `# ${projectName}\n\nEstructura del proyecto:\n\n`;
      
      // Obtener todo el contenido
      const allContent = await this.getAllFilesContent(files);
      
      for (const [filePath, content] of allContent) {
        projectContent += `## ${filePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }

      await this.exportFile(`${projectName}.md`, projectContent);
    } catch (error) {
      console.error('Error exporting project:', error);
      throw new Error('No se pudo exportar el proyecto');
    }
  }

  // ==================== PROJECT MANAGEMENT ====================

  /**
   * Guardar proyecto
   */
  static async saveProject(name: string, files: FileItem[]): Promise<void> {
    try {
      // Guardar la estructura del proyecto
      const projectData = {
        id: Date.now().toString(),
        name,
        files,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Guardar en lista de proyectos
      const projects = await this.getProjectList();
      const existingIndex = projects.findIndex(p => p.name === name);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = projectData;
      } else {
        projects.push(projectData);
      }

      await AsyncStorage.setItem(this.STORAGE_KEYS.PROJECT_LIST, JSON.stringify(projects));
      
      // Guardar estructura actual
      await this.saveFileStructure(files);
    } catch (error) {
      console.error('Error saving project:', error);
      throw new Error('No se pudo guardar el proyecto');
    }
  }

  /**
   * Cargar proyecto
   */
  static async loadProject(projectName: string): Promise<FileItem[] | null> {
    try {
      const projects = await this.getProjectList();
      const project = projects.find(p => p.name === projectName);
      
      if (project) {
        await this.saveFileStructure(project.files);
        return project.files;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  }

  /**
   * Obtener lista de proyectos
   */
  static async getProjectList(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.PROJECT_LIST);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting project list:', error);
      return [];
    }
  }

  // ==================== HELPERS ====================

  private static getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'js': 'text/javascript',
      'html': 'text/html',
      'css': 'text/css',
      'json': 'application/json',
      'md': 'text/markdown',
      'txt': 'text/plain',
      'py': 'text/x-python',
      'java': 'text/x-java-source'
    };
    
    return mimeTypes[extension || ''] || 'text/plain';
  }

  private static async getAllFilesContent(files: FileItem[]): Promise<Map<string, string>> {
    const content = new Map<string, string>();
    
    const processFiles = async (items: FileItem[], basePath = '') => {
      for (const item of items) {
        if (item.type === 'file') {
          const fullPath = basePath + item.name;
          const fileContent = await this.loadFileContent(item.id);
          content.set(fullPath, fileContent);
        } else if (item.type === 'folder' && item.children) {
          await processFiles(item.children, basePath + item.name + '/');
        }
      }
    };

    await processFiles(files);
    return content;
  }

  /**
   * Limpiar archivos huérfanos (sin referencia en la estructura)
   */
  static async cleanupOrphanedFiles(): Promise<void> {
    try {
      const files = await this.loadFileStructure();
      const allKeys = await AsyncStorage.getAllKeys();
      const fileContentKeys = allKeys.filter(key => 
        key.startsWith(this.STORAGE_KEYS.FILE_CONTENT)
      );

      // Obtener IDs válidos
      const validIds = new Set<string>();
      const collectIds = (items: FileItem[]) => {
        items.forEach(item => {
          validIds.add(item.id);
          if (item.children) {
            collectIds(item.children);
          }
        });
      };
      collectIds(files);

      // Eliminar archivos huérfanos
      for (const key of fileContentKeys) {
        const fileId = key.replace(this.STORAGE_KEYS.FILE_CONTENT, '');
        if (!validIds.has(fileId)) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }

  // ==================== CLIPBOARD OPERATIONS ====================
  
  private static clipboard: { file: FileItem; operation: 'copy' | 'cut' } | null = null;

  /**
   * Copia un archivo/carpeta al portapapeles
   */
  static copyToClipboard(file: FileItem): void {
    this.clipboard = { file: { ...file }, operation: 'copy' };
  }

  static cutToClipboard(file: FileItem): void {
    this.clipboard = { file: { ...file }, operation: 'cut' };
  }

  /**
   * Obtiene el elemento del portapapeles
   */
  static getClipboardItem(): { file: FileItem; operation: 'copy' | 'cut' } | null {
    return this.clipboard;
  }

  /**
   * Limpia el portapapeles
   */
  static clearClipboard(): void {
    this.clipboard = null;
  }

  /**
   * Verifica si hay contenido en el portapapeles
   */
  static hasClipboardContent(): boolean {
    return this.clipboard !== null;
  }

  static async renameFileOrFolder(
    files: FileItem[], 
    targetId: string, 
    newName: string
  ): Promise<FileItem[]> {
    try {
      const renameInTree = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === targetId) {
            const updatedItem = { ...item, name: newName };
            if (item.type === 'file') {
              const lastDot = newName.lastIndexOf('.');
              updatedItem.extension = lastDot > 0 ? newName.substring(lastDot + 1) : '';
            }
            return updatedItem;
          }
          
          if (item.children) {
            return { ...item, children: renameInTree(item.children) };
          }
          
          return item;
        });
      };

      const updatedFiles = renameInTree(files);
      await this.saveFileStructure(updatedFiles);
      
      return updatedFiles;
    } catch (error) {
      console.error('❌ Error renaming file/folder:', error);
      throw new Error(`No se pudo renombrar el elemento: ${error}`);
    }
  }

  static async deleteFileOrFolder(
    files: FileItem[], 
    targetId: string
  ): Promise<FileItem[]> {
    try {
      const deleteFromTree = (items: FileItem[]): FileItem[] => {
        return items.filter(item => {
          if (item.id === targetId) {
            if (item.type === 'file') {
              this.deleteFile(item.id).catch(err => 
                console.warn('⚠️ Could not delete file content:', err)
              );
            }
            return false;
          }
          
          if (item.children) {
            item.children = deleteFromTree(item.children);
          }
          
          return true;
        });
      };

      const updatedFiles = deleteFromTree(files);
      await this.saveFileStructure(updatedFiles);
      
      return updatedFiles;
    } catch (error) {
      console.error('❌ Error deleting file/folder:', error);
      throw new Error(`No se pudo eliminar el elemento: ${error}`);
    }
  }

  // ==================== EXISTING OPERATIONS ====================

  /**
   * Pega un archivo/carpeta desde el portapapeles
   */
  static async pasteFromClipboard(
    files: FileItem[], 
    targetFolderPath?: string
  ): Promise<FileItem[]> {
    try {
      if (!this.clipboard) {
        throw new Error('No hay elementos para pegar');
      }

      const { file: clipboardFile, operation } = this.clipboard;
      
      const newId = Date.now().toString();
      const newName = operation === 'copy' ? `${clipboardFile.name} - copia` : clipboardFile.name;
      
      const newItem: FileItem = {
        ...clipboardFile,
        id: newId,
        name: newName,
        path: targetFolderPath ? `${targetFolderPath}/${newName}` : `/${newName}`,
        children: clipboardFile.children ? await this.duplicateChildren(clipboardFile.children, `${targetFolderPath || ''}/${newName}`) : undefined
      };

      if (operation === 'copy' && clipboardFile.type === 'file') {
        try {
          const originalContent = await this.loadFileContent(clipboardFile.id);
          await this.saveFileContent(newId, originalContent);
        } catch (error) {
          console.warn('⚠️ Could not duplicate file content:', error);
        }
      }

      // Agregar el elemento a la estructura
      let updatedFiles: FileItem[];
      
      if (targetFolderPath) {
        updatedFiles = this.addToFolder(files, targetFolderPath, newItem);
      } else {
        updatedFiles = [...files, newItem];
      }

      if (operation === 'cut') {
        updatedFiles = await this.deleteFileOrFolder(updatedFiles, clipboardFile.id);
        this.clearClipboard();
      }

      await this.saveFileStructure(updatedFiles);
      
      return updatedFiles;
    } catch (error) {
      console.error('❌ Error pasting from clipboard:', error);
      throw new Error(`No se pudo pegar el elemento: ${error}`);
    }
  }

  /**
   * Duplica los hijos de una carpeta para operaciones de copia
   */
  private static async duplicateChildren(children: FileItem[], parentPath: string): Promise<FileItem[]> {
    const duplicatedChildren: FileItem[] = [];
    
    for (const child of children) {
      const newChildId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newChild: FileItem = {
        ...child,
        id: newChildId,
        path: `${parentPath}/${child.name}`,
        children: child.children ? await this.duplicateChildren(child.children, `${parentPath}/${child.name}`) : undefined
      };
      
      if (child.type === 'file') {
        try {
          const content = await this.loadFileContent(child.id);
          await this.saveFileContent(newChildId, content);
        } catch (error) {
          console.warn('⚠️ Could not duplicate child file content:', error);
        }
      }
      
      duplicatedChildren.push(newChild);
    }
    
    return duplicatedChildren;
  }

  private static addToFolder(files: FileItem[], targetFolderPath: string, newItem: FileItem): FileItem[] {
    return files.map(file => {
      if (file.path === targetFolderPath && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newItem]
        };
      } else if (file.children) {
        return {
          ...file,
          children: this.addToFolder(file.children, targetFolderPath, newItem)
        };
      }
      return file;
    });
  }
}