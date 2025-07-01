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
  
  /**
   * Guarda la estructura de archivos
   */
  static async saveFileStructure(files: FileItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.FILES_STRUCTURE, 
        JSON.stringify(files)
      );
    } catch (error) {
      console.error('Error saving file structure:', error);
      throw new Error('No se pudo guardar la estructura de archivos');
    }
  }

  /**
   * Carga la estructura de archivos
   */
  static async loadFileStructure(): Promise<FileItem[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.FILES_STRUCTURE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading file structure:', error);
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
}
