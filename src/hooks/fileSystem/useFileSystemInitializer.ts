import { FileSystemManager } from '@/src/utils/fileSystem/FileSystemManager';
import { useCallback, useState } from 'react';

/**
 * Hook para inicializar el sistema de archivos con contenido de ejemplo
 */
export const useFileSystemInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeWithSampleFiles = useCallback(async () => {
    setIsInitializing(true);
    
    try {
      // Contenido específico para archivos de ejemplo
      const sampleContents = {
        '2': `// Simple Game in JavaScript
let score = 0;
let player = {
    x: 50,
    y: 50,
    speed: 5
};

function updateGame() {
    // Game logic here
    console.log('Game updated! Score:', score);
}

function handleInput(key) {
    switch(key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
    }
}

// Start the game
setInterval(updateGame, 1000/60); // 60 FPS
console.log('Game started!');`,

        '3': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <h1>My Awesome Game</h1>
        <div class="game-board" id="gameBoard">
            <div class="player" id="player"></div>
        </div>
        <div class="score">Score: <span id="score">0</span></div>
        <div class="controls">
            <p>Use arrow keys to move</p>
        </div>
    </div>
    <script src="game.js"></script>
</body>
</html>`,

        '4': `# Simple Game Project

Welcome to my simple game project! 🎮

## Description

This is a basic HTML5 game built with vanilla JavaScript. The player can move around using arrow keys and the score increases over time.

## Features

- Player movement with arrow keys
- Score tracking
- Responsive design
- Clean, modern UI

## Files Structure

- \`index.html\` - Main HTML file
- \`game.js\` - Game logic and mechanics
- \`style.css\` - Styling and layout
- \`README.md\` - This documentation

## How to Play

1. Open \`index.html\` in your browser
2. Use arrow keys (↑↓←→) to move the player
3. Try to get the highest score possible!

## Next Steps

- [ ] Add obstacles
- [ ] Implement collision detection
- [ ] Add sound effects
- [ ] Create multiple levels

---

*Happy coding! 🚀*`,

        '5': `/* Game Styles */
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    overflow: hidden;
}

.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
}

h1 {
    margin-bottom: 20px;
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.game-board {
    width: 400px;
    height: 400px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    position: relative;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
}

.player {
    width: 20px;
    height: 20px;
    background-color: #ff4757;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(255, 71, 87, 0.8);
    transition: all 0.1s ease;
}

.score {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.controls {
    text-align: center;
    opacity: 0.8;
}

.controls p {
    margin: 5px 0;
    font-size: 0.9em;
}

/* Responsive design */
@media (max-width: 480px) {
    .game-board {
        width: 300px;
        height: 300px;
    }
    
    h1 {
        font-size: 2em;
    }
    
    .score {
        font-size: 1.2em;
    }
}`
      };

      // Guardar contenido para cada archivo
      for (const [fileId, content] of Object.entries(sampleContents)) {
        await FileSystemManager.saveFileContent(fileId, content);
      }

      console.log('Sample files initialized with content!');
      
    } catch (error) {
      console.error('Error initializing sample files:', error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return {
    initializeWithSampleFiles,
    isInitializing
  };
};
