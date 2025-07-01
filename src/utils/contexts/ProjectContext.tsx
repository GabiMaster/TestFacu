import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import { Project, ProjectManager, RecentProject } from '@/src/utils/project/ProjectManager';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface ProjectContextType {
  // Estado
  projects: Project[];
  recentProjects: RecentProject[];
  currentProject: Project | null;
  isLoading: boolean;

  // Operaciones de proyecto
  createProject: (name: string, description?: string, language?: string, type?: string, initialFiles?: FileItem[]) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  openProject: (project: Project) => Promise<Project>;
  closeProject: () => Promise<void>;
  
  // Gestión de archivos del proyecto actual
  updateCurrentProjectFiles: (fileStructure: FileItem[]) => Promise<void>;
  
  // Búsqueda y filtros
  searchProjects: (query: string) => Promise<Project[]>;
  
  // Gestión de estado
  refreshProjects: () => Promise<void>;
  refreshRecentProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const [allProjects, recent, current] = await Promise.all([
        ProjectManager.getAllProjects(),
        ProjectManager.getRecentProjects(),
        ProjectManager.getCurrentProject()
      ]);

      setProjects(allProjects);
      setRecentProjects(recent);
      setCurrentProject(current);
      
    } catch (error) {
      console.error('❌ Error loading initial project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (
    name: string, 
    description?: string, 
    language?: string, 
    type?: string,
    initialFiles?: FileItem[]
  ): Promise<Project> => {
    try {
      const newProject = await ProjectManager.createProject(name, description, language, type, initialFiles);
      
      setProjects(prev => [...prev, newProject]);
      
      return newProject;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    try {
      const updatedProject = await ProjectManager.updateProject(id, updates);
      
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      
      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }
      
      return updatedProject;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      await ProjectManager.deleteProject(id);
      
      setProjects(prev => prev.filter(p => p.id !== id));
      setRecentProjects(prev => prev.filter(p => p.id !== id));
      
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  }, [currentProject?.id]);

  const openProject = useCallback(async (project: Project): Promise<Project> => {
    try {
      await ProjectManager.setCurrentProject(project);
      
      setCurrentProject(project);
      
      const recent = await ProjectManager.getRecentProjects();
      setRecentProjects(recent);
      
      return project;
    } catch (error) {
      console.error('❌ Error opening project:', error);
      throw error;
    }
  }, []);

  const closeProject = async (): Promise<void> => {
    try {
      console.log('🔒 Closing current project');
      await ProjectManager.clearCurrentProject();
      
      setCurrentProject(null);
      
    } catch (error) {
      console.error('❌ Error closing project:', error);
    }
  };

  const updateCurrentProjectFiles = async (fileStructure: FileItem[]): Promise<void> => {
    try {
      if (!currentProject) {
        console.warn('⚠️ No current project to update files');
        return;
      }
      
      await ProjectManager.updateCurrentProjectFiles(fileStructure);
      
      const updatedProject = { ...currentProject, fileStructure, lastModified: new Date().toISOString() };
      setCurrentProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
      
    } catch (error) {
      console.error('❌ Error updating current project files:', error);
      throw error;
    }
  };

  const searchProjects = async (query: string): Promise<Project[]> => {
    try {
      const results = await ProjectManager.searchProjects(query);
      return results;
    } catch (error) {
      console.error('❌ Error searching projects:', error);
      return [];
    }
  };

  const refreshProjects = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Refreshing projects...');
      const allProjects = await ProjectManager.getAllProjects();
      setProjects(allProjects);
      console.log('✅ Projects refreshed:', allProjects.length);
    } catch (error) {
      console.error('❌ Error refreshing projects:', error);
    }
  }, []);

  const refreshRecentProjects = useCallback(async (): Promise<void> => {
    try {
      const recent = await ProjectManager.getRecentProjects();
      setRecentProjects(recent);
      // Solo logear si hay cambios significativos
      if (recent.length !== recentProjects.length) {
        console.log('✅ Recent projects updated:', recent.length);
      }
    } catch (error) {
      console.error('❌ Error refreshing recent projects:', error);
    }
  }, [recentProjects.length]);

  const contextValue: ProjectContextType = {
    // Estado
    projects,
    recentProjects,
    currentProject,
    isLoading,
    
    // Operaciones
    createProject,
    updateProject,
    deleteProject,
    openProject,
    closeProject,
    updateCurrentProjectFiles,
    searchProjects,
    refreshProjects,
    refreshRecentProjects,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
