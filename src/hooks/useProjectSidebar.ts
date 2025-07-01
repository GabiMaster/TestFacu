import { useProjectContext } from '@/src/utils/contexts/ProjectContext';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { useCallback, useEffect } from 'react';

/**
 * Hook personalizado que mantiene sincronizado el estado del sidebar
 * con el proyecto actual
 */
export const useProjectSidebar = () => {
  const { files, updateCurrentProjectFiles } = useSidebarContext();
  const { currentProject } = useProjectContext();

  // Sincronizar archivos del sidebar con el proyecto actual
  const syncFilesWithProject = useCallback(async () => {
    if (currentProject && files.length > 0) {
      try {
        console.log('🔄 Syncing sidebar files with current project');
        await updateCurrentProjectFiles(files);
        console.log('✅ Files synced with project');
      } catch (error) {
        console.error('❌ Error syncing files with project:', error);
      }
    }
  }, [currentProject, files, updateCurrentProjectFiles]);

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
