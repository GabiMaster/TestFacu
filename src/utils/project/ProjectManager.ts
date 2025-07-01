import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastModified: string;
  fileStructure: FileItem[];
  language?: string;
  type?: string;
}

export interface RecentProject {
  id: string;
  name: string;
  lastModified: string;
  language?: string;
}

export class ProjectManager {
  private static readonly PROJECTS_KEY = 'app_projects';
  private static readonly RECENT_PROJECTS_KEY = 'app_recent_projects';
  private static readonly CURRENT_PROJECT_KEY = 'app_current_project';

  // ==================== PROJECT CRUD OPERATIONS ====================

  /**
   * Obtiene todos los proyectos guardados
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      const projectsData = await AsyncStorage.getItem(this.PROJECTS_KEY);
      if (projectsData) {
        const projects = JSON.parse(projectsData);
        return projects;
      }
      return [];
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      return [];
    }
  }

  /**
   * Obtiene un proyecto por ID
   */
  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const projects = await this.getAllProjects();
      const project = projects.find(p => p.id === id);
      return project || null;
    } catch (error) {
      console.error('❌ Error getting project:', error);
      return null;
    }
  }

  /**
   * Crea una estructura de archivos por defecto basada en el lenguaje
   */
  private static createDefaultFileStructure(language?: string, projectName?: string): FileItem[] {
    const projectFolder = projectName || 'proyecto';
    const baseId = Date.now();
    
    switch (language?.toLowerCase()) {
      case 'javascript':
      case 'js':
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'index.js',
                type: 'file',
                path: `/${projectFolder}/index.js`,
                extension: 'js'
              },
              {
                id: `${baseId}_3`,
                name: 'README.md',
                type: 'file',
                path: `/${projectFolder}/README.md`,
                extension: 'md'
              }
            ]
          }
        ];
      
      case 'typescript':
      case 'ts':
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'index.ts',
                type: 'file',
                path: `/${projectFolder}/index.ts`,
                extension: 'ts'
              },
              {
                id: `${baseId}_3`,
                name: 'tsconfig.json',
                type: 'file',
                path: `/${projectFolder}/tsconfig.json`,
                extension: 'json'
              },
              {
                id: `${baseId}_4`,
                name: 'README.md',
                type: 'file',
                path: `/${projectFolder}/README.md`,
                extension: 'md'
              }
            ]
          }
        ];

      case 'python':
      case 'py':
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'main.py',
                type: 'file',
                path: `/${projectFolder}/main.py`,
                extension: 'py'
              },
              {
                id: `${baseId}_3`,
                name: 'requirements.txt',
                type: 'file',
                path: `/${projectFolder}/requirements.txt`,
                extension: 'txt'
              },
              {
                id: `${baseId}_4`,
                name: 'README.md',
                type: 'file',
                path: `/${projectFolder}/README.md`,
                extension: 'md'
              }
            ]
          }
        ];

      case 'java':
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'src',
                type: 'folder',
                path: `/${projectFolder}/src`,
                isOpen: true,
                children: [
                  {
                    id: `${baseId}_3`,
                    name: 'Main.java',
                    type: 'file',
                    path: `/${projectFolder}/src/Main.java`,
                    extension: 'java'
                  }
                ]
              },
              {
                id: `${baseId}_4`,
                name: 'README.md',
                type: 'file',
                path: `/${projectFolder}/README.md`,
                extension: 'md'
              }
            ]
          }
        ];

      case 'html':
      case 'web':
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'index.html',
                type: 'file',
                path: `/${projectFolder}/index.html`,
                extension: 'html'
              },
              {
                id: `${baseId}_3`,
                name: 'style.css',
                type: 'file',
                path: `/${projectFolder}/style.css`,
                extension: 'css'
              },
              {
                id: `${baseId}_4`,
                name: 'script.js',
                type: 'file',
                path: `/${projectFolder}/script.js`,
                extension: 'js'
              }
            ]
          }
        ];

      default:
        return [
          {
            id: `${baseId}_1`,
            name: projectFolder,
            type: 'folder',
            path: `/${projectFolder}`,
            isOpen: true,
            children: [
              {
                id: `${baseId}_2`,
                name: 'main.txt',
                type: 'file',
                path: `/${projectFolder}/main.txt`,
                extension: 'txt'
              },
              {
                id: `${baseId}_3`,
                name: 'README.md',
                type: 'file',
                path: `/${projectFolder}/README.md`,
                extension: 'md'
              }
            ]
          }
        ];
    }
  }

  /**
   * Crea un nuevo proyecto
   */
  static async createProject(
    name: string, 
    description?: string, 
    language?: string,
    type?: string,
    initialFiles?: FileItem[]
  ): Promise<Project> {
    try {
      const now = new Date().toISOString();
      const defaultFiles = initialFiles || this.createDefaultFileStructure(language, name);
      
      const newProject: Project = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        description: description?.trim(),
        createdAt: now,
        lastModified: now,
        fileStructure: defaultFiles,
        language,
        type
      };

      const projects = await this.getAllProjects();
      projects.push(newProject);
      
      await AsyncStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
      
      return newProject;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw new Error('No se pudo crear el proyecto');
    }
  }

  /**
   * Actualiza un proyecto existente
   */
  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const projects = await this.getAllProjects();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw new Error('Proyecto no encontrado');
      }

      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };

      await AsyncStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
      
      return projects[projectIndex];
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw new Error('No se pudo actualizar el proyecto');
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const projects = await this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== id);
      
      await AsyncStorage.setItem(this.PROJECTS_KEY, JSON.stringify(filteredProjects));
      await this.removeFromRecentProjects(id);
      
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw new Error('No se pudo eliminar el proyecto');
    }
  }

  // ==================== CURRENT PROJECT MANAGEMENT ====================

  /**
   * Establece el proyecto actual
   */
  static async setCurrentProject(project: Project): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CURRENT_PROJECT_KEY, JSON.stringify(project));
      await this.addToRecentProjects(project);
      
    } catch (error) {
      console.error('❌ Error setting current project:', error);
      throw new Error('No se pudo establecer el proyecto actual');
    }
  }

  /**
   * Obtiene el proyecto actual
   */
  static async getCurrentProject(): Promise<Project | null> {
    try {
      const projectData = await AsyncStorage.getItem(this.CURRENT_PROJECT_KEY);
      if (projectData) {
        return JSON.parse(projectData);
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting current project:', error);
      return null;
    }
  }

  /**
   * Limpia el proyecto actual
   */
  static async clearCurrentProject(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CURRENT_PROJECT_KEY);
    } catch (error) {
      console.error('❌ Error clearing current project:', error);
    }
  }

  /**
   * Actualiza la estructura de archivos del proyecto actual
   */
  static async updateCurrentProjectFiles(fileStructure: FileItem[]): Promise<void> {
    try {
      const currentProject = await this.getCurrentProject();
      if (currentProject) {
        const updatedProject = await this.updateProject(currentProject.id, {
          fileStructure,
          lastModified: new Date().toISOString()
        });
        
        await this.setCurrentProject(updatedProject);
      }
    } catch (error) {
      console.error('❌ Error updating current project files:', error);
    }
  }

  // ==================== RECENT PROJECTS MANAGEMENT ====================

  /**
   * Obtiene los proyectos recientes
   */
  static async getRecentProjects(): Promise<RecentProject[]> {
    try {
      const recentData = await AsyncStorage.getItem(this.RECENT_PROJECTS_KEY);
      if (recentData) {
        const recent = JSON.parse(recentData);
        return recent.sort((a: RecentProject, b: RecentProject) => 
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );
      }
      return [];
    } catch (error) {
      console.error('❌ Error loading recent projects:', error);
      return [];
    }
  }

  /**
   * Agrega un proyecto a la lista de recientes
   */
  static async addToRecentProjects(project: Project): Promise<void> {
    try {
      const recentProjects = await this.getRecentProjects();
      
      const filtered = recentProjects.filter(p => p.id !== project.id);
      
      const newRecent: RecentProject = {
        id: project.id,
        name: project.name,
        lastModified: project.lastModified,
        language: project.language
      };
      
      filtered.unshift(newRecent);
      
      const limited = filtered.slice(0, 10);
      
      await AsyncStorage.setItem(this.RECENT_PROJECTS_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('❌ Error adding to recent projects:', error);
    }
  }

  static async removeFromRecentProjects(projectId: string): Promise<void> {
    try {
      const recentProjects = await this.getRecentProjects();
      const filtered = recentProjects.filter(p => p.id !== projectId);
      
      await AsyncStorage.setItem(this.RECENT_PROJECTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('❌ Error removing from recent projects:', error);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Obtiene proyectos filtrados por búsqueda
   */
  static async searchProjects(query: string): Promise<Project[]> {
    try {
      const projects = await this.getAllProjects();
      const lowerQuery = query.toLowerCase();
      
      return projects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description?.toLowerCase().includes(lowerQuery) ||
        project.language?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('❌ Error searching projects:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de proyectos
   */
  static async getProjectStats(): Promise<{
    totalProjects: number;
    languageStats: { [key: string]: number };
    recentProjectsCount: number;
  }> {
    try {
      const projects = await this.getAllProjects();
      const recentProjects = await this.getRecentProjects();
      
      const languageStats: { [key: string]: number } = {};
      projects.forEach(project => {
        if (project.language) {
          languageStats[project.language] = (languageStats[project.language] || 0) + 1;
        }
      });

      return {
        totalProjects: projects.length,
        languageStats,
        recentProjectsCount: recentProjects.length
      };
    } catch (error) {
      console.error('❌ Error getting project stats:', error);
      return {
        totalProjects: 0,
        languageStats: {},
        recentProjectsCount: 0
      };
    }
  }
}
