import { FileItem } from '@/src/hooks/sidebar/useSidebar';
import { FileSystemManager } from '@/src/utils/fileSystem/FileSystemManager';
import { getDefaultContentByFileName } from '@/src/utils/fileSystem/defaultFileContents';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para manejar la carga y guardado de contenido de archivos en el editor
 */
export const useEditorFile = (selectedFile: FileItem | null) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState('');

  // Cargar contenido del archivo seleccionado
  const loadFileContent = useCallback(async (file: FileItem) => {
    if (!file || file.type !== 'file') return;

    setIsLoading(true);
    try {
      const fileContent = await FileSystemManager.loadFileContent(file.id);
      let actualContent = fileContent;
      
      // Si el archivo está vacío, usar contenido por defecto
      if (!fileContent || fileContent.trim() === '') {
        actualContent = getDefaultContentByFileName(file.name);
        // Guardar el contenido por defecto
        await FileSystemManager.saveFileContent(file.id, actualContent);
      } else {
        // Verificar si el contenido es correcto para el tipo de archivo
        const extension = file.name.split('.').pop()?.toLowerCase();
        const isJavaFile = extension === 'java';
        const hasWrongContent = isJavaFile && fileContent.includes('def ') && fileContent.includes('print(');
        
        if (hasWrongContent) {
          console.log('🔧 Corrigiendo contenido incorrecto para archivo Java:', file.name);
          actualContent = getDefaultContentByFileName(file.name);
          // Guardar el contenido corregido
          await FileSystemManager.saveFileContent(file.id, actualContent);
        }
      }
      
      setContent(actualContent);
      setOriginalContent(actualContent);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading file content:', error);
      // Usar contenido por defecto si hay error
      const defaultContent = getDefaultContentByFileName(file.name);
      setContent(defaultContent);
      setOriginalContent(defaultContent);
      setHasUnsavedChanges(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar contenido del archivo
  const saveFileContent = useCallback(async () => {
    if (!selectedFile || selectedFile.type !== 'file') return false;

    setIsSaving(true);
    try {
      await FileSystemManager.saveFileContent(selectedFile.id, content);
      setOriginalContent(content);
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving file content:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [selectedFile, content]);

  // Actualizar contenido
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(newContent !== originalContent);
  }, [originalContent]);

  // Efecto para cargar archivo cuando cambia la selección
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      loadFileContent(selectedFile);
    } else {
      // Limpiar contenido si no hay archivo seleccionado
      setContent('');
      setOriginalContent('');
      setHasUnsavedChanges(false);
    }
  }, [selectedFile, loadFileContent]);

  // Auto-guardado cada 5 segundos si hay cambios
  useEffect(() => {
    if (!hasUnsavedChanges || !selectedFile) return;

    const autoSaveTimer = setTimeout(() => {
      saveFileContent();
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, selectedFile, saveFileContent]);

  return {
    content,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    updateContent,
    saveFileContent,
    loadFileContent
  };
};
