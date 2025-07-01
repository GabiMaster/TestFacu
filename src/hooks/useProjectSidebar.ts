import { useProjectContext } from '@/src/utils/contexts/ProjectContext';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { useCallback, useEffect } from 'react';

/**
 * Hook personalizado que mantiene sincronizado el estado del sidebar
 * con el proyecto actual
 */
export const useProjectSidebar = () => {
  const { files, updateFiles } = useSidebarContext();
  const { currentProject } = useProjectContext();

  const syncFilesWithProject = useCallback(async () => {
    if (currentProject && files.length > 0) {
      try {
        updateFiles(files);
      } catch (error) {
        console.error('❌ Error syncing files with project:', error);
      }
    }
  }, [currentProject, files, updateFiles]);

  // Sincronizar archivos cada vez que cambien
  useEffect(() => {
    if (currentProject) {
      syncFilesWithProject();
    }
  }, [files, syncFilesWithProject, currentProject]);

  return {
    currentProject,
    syncFilesWithProject,
  };
};
