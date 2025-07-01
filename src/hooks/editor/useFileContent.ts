import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

interface FileContent {
  id: string;
  content: string;
  lastModified: number;
}

export const useFileContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveFileContent = useCallback(async (fileId: string, content: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileContent: FileContent = {
        id: fileId,
        content,
        lastModified: Date.now()
      };
      
      await AsyncStorage.setItem(
        `file_content_${fileId}`,
        JSON.stringify(fileContent)
      );
    } catch (error) {
      console.error('Error saving file content:', error);
      setError('No se pudo guardar el archivo');
      throw new Error('No se pudo guardar el archivo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFileContent = useCallback(async (fileId: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stored = await AsyncStorage.getItem(`file_content_${fileId}`);
      if (stored) {
        const fileContent: FileContent = JSON.parse(stored);
        return fileContent.content;
      }
      
      // Si no existe el archivo, retornar contenido por defecto basado en extensión
      return getDefaultContent(fileId);
    } catch (error) {
      console.error('Error loading file content:', error);
      setError('No se pudo cargar el archivo');
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFileContent = useCallback(async (fileId: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(`file_content_${fileId}`);
    } catch (error) {
      console.error('Error deleting file content:', error);
      setError('No se pudo eliminar el archivo');
      throw new Error('No se pudo eliminar el archivo');
    }
  }, []);

  const getFileInfo = useCallback(async (fileId: string): Promise<FileContent | null> => {
    try {
      const stored = await AsyncStorage.getItem(`file_content_${fileId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    saveFileContent,
    loadFileContent,
    deleteFileContent,
    getFileInfo,
    isLoading,
    error,
    clearError,
  };
};

// Función helper para contenido por defecto
const getDefaultContent = (fileId: string): string => {
  // Aquí puedes mapear contenido por defecto para archivos específicos
  const defaultContents: Record<string, string> = {
    '2': `// Game logic
function startGame() {
    console.log("Starting game...");
    initializePlayer();
    setupGameLoop();
}

function initializePlayer() {
    player = {
        x: 100,
        y: 100,
        health: 100
    };
}

function setupGameLoop() {
    setInterval(gameLoop, 16);
}

function gameLoop() {
    updatePlayer();
    renderGame();
}`,
    '3': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <canvas id="game-canvas"></canvas>
        <div id="ui-overlay">
            <div id="health-bar"></div>
            <div id="score">Score: 0</div>
        </div>
    </div>
    <script src="game.js"></script>
</body>
</html>`,
    '4': `# Game Project

## Description
This is a simple game project created with HTML5 Canvas and JavaScript.

## Features
- Player movement
- Health system
- Score tracking
- Game loop optimization

## How to run
1. Open index.html in your browser
2. Use arrow keys to move the player
3. Enjoy the game!

## Todo
- Add sound effects
- Implement power-ups
- Create level system`,
    '5': `/* Game Styles */
body {
    margin: 0;
    padding: 0;
    background-color: #000;
    font-family: Arial, sans-serif;
}

#game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-canvas {
    border: 2px solid #fff;
    background-color: #001122;
}

#ui-overlay {
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
}

#health-bar {
    width: 200px;
    height: 20px;
    background-color: #ff0000;
    border: 2px solid #fff;
    margin-bottom: 10px;
}

#score {
    font-size: 18px;
    font-weight: bold;
}`
  };

  return defaultContents[fileId] || '';
};
