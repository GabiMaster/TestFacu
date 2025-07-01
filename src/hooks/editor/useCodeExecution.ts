import { useCallback, useState } from 'react';

interface ExecutionResult {
  output: string[];
  errors: string[];
  success: boolean;
  executionTime: number;
}

interface UseCodeExecutionProps {
  onOutput?: (message: string, type: 'output' | 'error' | 'system') => void;
}

export const useCodeExecution = ({ onOutput }: UseCodeExecutionProps = {}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);

  // Función principal para ejecutar código
  const executeCode = useCallback(async (code: string, language: string): Promise<ExecutionResult> => {
    if (isExecuting) {
      throw new Error('Ya hay una ejecución en progreso');
    }

    setIsExecuting(true);
    const startTime = Date.now();
    
    try {
      onOutput?.(`> Ejecutando ${language}...`, 'system');
      
      let result: ExecutionResult;
      
      switch (language.toLowerCase()) {
        case 'python':
          result = await executePython(code);
          break;
        case 'javascript':
          result = await executeJavaScript(code);
          break;
        case 'java':
          result = await executeJavaCode(code);
          break;
        case 'html':
          result = await executeHtml(code);
          break;
        case 'mysql':
          result = await executeMySQL(code);
          break;
        default:
          result = {
            output: [],
            errors: [`Lenguaje '${language}' no soportado`],
            success: false,
            executionTime: 0
          };
      }

      result.executionTime = Date.now() - startTime;
      setLastResult(result);
      
      // Enviar resultados a través del callback
      result.output.forEach(msg => onOutput?.(msg, 'output'));
      result.errors.forEach(msg => onOutput?.(msg, 'error'));
      
      if (result.success) {
        onOutput?.(`✓ Ejecución completada en ${result.executionTime}ms`, 'system');
      } else {
        onOutput?.(`✗ Ejecución falló`, 'system');
      }
      
      return result;
      
    } catch (error) {
      const errorResult: ExecutionResult = {
        output: [],
        errors: [`Error inesperado: ${error}`],
        success: false,
        executionTime: Date.now() - startTime
      };
      
      setLastResult(errorResult);
      onOutput?.(errorResult.errors[0], 'error');
      
      return errorResult;
    } finally {
      setIsExecuting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExecuting]);

  // Simulador de Python
  const executePython = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      const lines = code.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        // Detectar prints
        if (line.trim().startsWith('print(')) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let content = match[1];
            
            // Simular f-strings
            if (content.includes('f"') || content.includes("f'")) {
              content = content.replace(/f["'](.*)["']/, '$1');
              content = content.replace(/{([^}]+)}/g, (_, variable) => {
                // Variables simuladas
                const mockVars: Record<string, string> = {
                  'nombre': 'CodeFarm',
                  'i': Math.floor(Math.random() * 3).toString()
                };
                return mockVars[variable] || variable;
              });
            }
            
            content = content.replace(/["']/g, '');
            output.push(content);
          }
        }
        
        // Detectar loops for
        else if (line.includes('for i in range(')) {
          const match = line.match(/range\((\d+)\)/);
          if (match) {
            const count = parseInt(match[1]);
            for (let i = 0; i < count; i++) {
              await new Promise(resolve => setTimeout(resolve, 100));
              output.push(`Número: ${i}`);
            }
          }
        }
        
        // Simular errores comunes
        else if (line.includes('undefined_variable')) {
          errors.push("NameError: name 'undefined_variable' is not defined");
        }
        
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: 0
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de Python: ${error}`],
        success: false,
        executionTime: 0
      };
    }
  };

  // Ejecutor completamente reescrito de JavaScript
  const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      // Crear mocks para APIs del navegador/DOM
      const mockConsole = {
        log: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output.push(message);
        },
        error: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          errors.push(`Console Error: ${message}`);
        },
        warn: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output.push(`Console Warn: ${message}`);
        }
      };

      // Mock para Canvas 2D Context
      const mockCanvas2D = {
        fillStyle: '#000000',
        strokeStyle: '#000000',
        font: '10px sans-serif',
        lineWidth: 1,
        globalAlpha: 1,
        fillRect: (x: number, y: number, w: number, h: number) => {
          output.push(`🎨 Dibujando rectángulo relleno en (${x}, ${y}) tamaño ${w}x${h}`);
        },
        strokeRect: (x: number, y: number, w: number, h: number) => {
          output.push(`🎨 Dibujando rectángulo contorno en (${x}, ${y}) tamaño ${w}x${h}`);
        },
        clearRect: (x: number, y: number, w: number, h: number) => {
          output.push(`🧹 Limpiando área (${x}, ${y}) tamaño ${w}x${h}`);
        },
        fillText: (text: string, x: number, y: number) => {
          output.push(`📝 Texto "${text}" en (${x}, ${y})`);
        },
        beginPath: () => output.push('🎨 Iniciando nuevo trazado'),
        closePath: () => output.push('🎨 Cerrando trazado'),
        moveTo: (x: number, y: number) => output.push(`🎨 Moviendo a (${x}, ${y})`),
        lineTo: (x: number, y: number) => output.push(`🎨 Línea a (${x}, ${y})`),
        stroke: () => output.push('🎨 Trazando líneas'),
        fill: () => output.push('🎨 Rellenando forma'),
        arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
          output.push(`🎨 Arco en (${x}, ${y}) radio ${radius}`);
        },
        save: () => output.push('💾 Guardando estado del canvas'),
        restore: () => output.push('🔄 Restaurando estado del canvas')
      };

      // Mock para elementos DOM
      const mockCanvas = {
        getContext: (type: string) => {
          if (type === '2d') {
            return mockCanvas2D;
          }
          return null;
        },
        width: 400,
        height: 400,
        style: {}
      };

      const mockDocument = {
        getElementById: (id: string) => {
          output.push(`🔍 Buscando elemento con ID: ${id}`);
          if (id === 'gc' || id === 'game' || id === 'canvas') {
            return mockCanvas;
          }
          return null;
        },
        addEventListener: (event: string, handler: Function) => {
          output.push(`👂 Event listener agregado para: ${event}`);
          // Simular algunos eventos inmediatamente para testing
          if (event === 'DOMContentLoaded') {
            setTimeout(() => {
              try {
                handler();
              } catch (e) {
                errors.push(`Error en event handler: ${e}`);
              }
            }, 100);
          }
        },
        removeEventListener: (event: string, handler: Function) => {
          output.push(`🚫 Event listener removido para: ${event}`);
        },
        readyState: 'complete',
        body: {
          addEventListener: (event: string, handler: Function) => {
            output.push(`👂 Body event listener para: ${event}`);
          }
        }
      };

      const mockWindow = {
        addEventListener: (event: string, handler: Function) => {
          output.push(`🪟 Window event listener para: ${event}`);
          if (event === 'load' || event === 'DOMContentLoaded') {
            setTimeout(() => {
              try {
                handler();
              } catch (e) {
                errors.push(`Error en window event: ${e}`);
              }
            }, 50);
          }
          if (event === 'keydown' || event === 'keyup') {
            // Simular algunas teclas para testing
            setTimeout(() => {
              try {
                const mockEvent = { key: 'ArrowUp', keyCode: 38, preventDefault: () => {} };
                handler(mockEvent);
              } catch {
                // Ignorar errores de eventos simulados
              }
            }, 200);
          }
        },
        requestAnimationFrame: (callback: Function) => {
          output.push('🎬 Frame de animación solicitado');
          setTimeout(() => {
            try {
              callback(Date.now());
            } catch (e) {
              errors.push(`Error en animation frame: ${e}`);
            }
          }, 16); // ~60fps
          return 1;
        },
        cancelAnimationFrame: (id: number) => {
          output.push('🛑 Cancelando frame de animación');
        }
      };

      // Función para crear un sandbox más seguro
      const createSandbox = () => {
        return {
          console: mockConsole,
          document: mockDocument,
          window: mockWindow,
          setTimeout: (callback: Function, delay: number) => {
            output.push(`⏰ Timer configurado para ${delay}ms`);
            return setTimeout(callback, Math.min(delay, 1000)); // Limitar delays
          },
          setInterval: (callback: Function, delay: number) => {
            output.push(`🔄 Intervalo configurado para ${delay}ms`);
            return setInterval(callback, Math.max(delay, 100)); // Limitar frecuencia
          },
          clearTimeout: (id: any) => {
            output.push('⏰ Timer cancelado');
            clearTimeout(id);
          },
          clearInterval: (id: any) => {
            output.push('🔄 Intervalo cancelado');
            clearInterval(id);
          },
          Math: Math,
          Date: Date,
          Object: Object,
          Array: Array,
          JSON: JSON,
          parseInt: parseInt,
          parseFloat: parseFloat,
          isNaN: isNaN,
          Number: Number,
          String: String,
          Boolean: Boolean
        };
      };

      // Preparar el código - método más robusto sin 'with'
      const sandbox = createSandbox();
      
      // Crear lista de variables del sandbox para la función
      const sandboxKeys = Object.keys(sandbox);
      const sandboxValues = sandboxKeys.map(key => (sandbox as any)[key]);
      
      // Crear función que ejecuta el código en el contexto del sandbox
      const wrappedCode = `
        "use strict";
        try {
          ${code}
        } catch (error) {
          console.error("Execution error:", error.message);
          throw error;
        }
      `;
      
      // Ejecutar usando Function constructor con parámetros explícitos
      const executeFunction = new Function(...sandboxKeys, wrappedCode);
      
      // Ejecutar el código
      executeFunction(...sandboxValues);
      
      // Si llegamos aquí, la ejecución fue exitosa
      if (output.length === 0) {
        output.push('✅ Código ejecutado correctamente (sin salida visible)');
      }
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: 0
      };
      
    } catch (error) {
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido';
      
      if (error instanceof SyntaxError) {
        errorMessage = `Syntax Error: ${error.message}`;
      } else if (error instanceof ReferenceError) {
        errorMessage = `Reference Error: ${error.message}`;
      } else if (error instanceof TypeError) {
        errorMessage = `Type Error: ${error.message}`;
      } else {
        errorMessage = `Runtime Error: ${error}`;
      }
      
      errors.push(errorMessage);
      
      return {
        output,
        errors,
        success: false,
        executionTime: 0
      };
    }
  };

  // Simulador de Java
  const executeJavaCode = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      output.push('Compilando...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Detectar System.out.println
      if (code.includes('System.out.println')) {
        const matches = code.match(/System\.out\.println\((.*?)\);/g);
        if (matches) {
          for (const match of matches) {
            const content = match.match(/System\.out\.println\((.*?)\);/)?.[1];
            if (content) {
              let message = content.replace(/"/g, '');
              
              // Simular concatenación
              if (message.includes(' + ')) {
                message = message.replace(/ \+ /g, '');
                message = message.replace(/nombre/g, 'CodeFarm');
              }
              
              output.push(message);
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        }
      }
      
      // Detectar loops for
      if (code.includes('for(int i')) {
        for (let i = 0; i < 3; i++) {
          output.push(`Número: ${i}`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return {
        output,
        errors,
        success: true,
        executionTime: 0
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de Java: ${error}`],
        success: false,
        executionTime: 0
      };
    }
  };

  // Ejecutor mejorado de HTML (especialmente para juegos)
  const executeHtml = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      output.push('🎮 Analizando aplicación HTML...');
      
      // Detectar elementos del juego
      if (code.includes('<canvas')) {
        const canvasMatch = code.match(/<canvas[^>]*id=["']([^"']+)["'][^>]*>/);
        if (canvasMatch) {
          output.push(`✅ Canvas encontrado: ID="${canvasMatch[1]}"`);
        }
        
        const dimensionsMatch = code.match(/width=["']?(\d+)["']?[^>]*height=["']?(\d+)["']?/);
        if (dimensionsMatch) {
          output.push(`📐 Dimensiones: ${dimensionsMatch[1]}x${dimensionsMatch[2]}px`);
        }
      }
      
      // Detectar scripts
      const scriptMatches = code.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/g);
      if (scriptMatches) {
        scriptMatches.forEach(script => {
          const srcMatch = script.match(/src=["']([^"']+)["']/);
          if (srcMatch) {
            output.push(`📄 Script externo: ${srcMatch[1]}`);
          }
        });
      }
      
      // Detectar CSS
      const cssMatches = code.match(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/g);
      if (cssMatches) {
        cssMatches.forEach(link => {
          const hrefMatch = link.match(/href=["']([^"']+)["']/);
          if (hrefMatch) {
            output.push(`🎨 Hoja de estilos: ${hrefMatch[1]}`);
          }
        });
      }
      
      // Detectar controles de juego
      if (code.includes('onclick=')) {
        const onclickMatches = code.match(/onclick=["']([^"']+)["']/g);
        if (onclickMatches) {
          output.push(`🎯 Controles interactivos encontrados: ${onclickMatches.length}`);
          onclickMatches.slice(0, 3).forEach(onclick => {
            const funcMatch = onclick.match(/onclick=["']([^"']+)["']/);
            if (funcMatch) {
              output.push(`  • ${funcMatch[1]}`);
            }
          });
        }
      }
      
      // Detectar elementos específicos de juego
      if (code.includes('class="keys"') || code.includes('class="arr"')) {
        output.push('🕹️ Controles táctiles detectados');
      }
      
      // Analizar título
      const titleMatch = code.match(/<title>(.*?)<\/title>/);
      if (titleMatch) {
        output.push(`📋 Título: "${titleMatch[1]}"`);
      }
      
      // Detectar si es un juego
      const gameIndicators = [
        'snake', 'game', 'canvas', 'onclick', 'keydown', 'score', 'points'
      ];
      
      const foundIndicators = gameIndicators.filter(indicator => 
        code.toLowerCase().includes(indicator)
      );
      
      if (foundIndicators.length >= 3) {
        output.push('🎮 ¡Aplicación de juego detectada!');
        output.push('💡 Sugerencia: Ejecuta los archivos JavaScript y CSS por separado');
        output.push('🚀 HTML listo para ser renderizado en navegador');
      }
      
      // Verificar estructura básica
      if (code.includes('<!DOCTYPE html>')) {
        output.push('✅ Estructura HTML5 válida');
      }
      
      if (code.includes('<meta name="viewport"')) {
        output.push('📱 Optimizado para dispositivos móviles');
      }
      
      output.push('✨ Análisis completado - HTML listo para ejecución');
      
      return {
        output,
        errors,
        success: true,
        executionTime: 0
      };
      
    } catch (error) {
      errors.push(`Error analizando HTML: ${error}`);
      return {
        output,
        errors,
        success: false,
        executionTime: 0
      };
    }
  };

  // Simulador de MySQL
  const executeMySQL = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      output.push('Conectando a la base de datos...');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const queries = code.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.startsWith('SELECT')) {
          output.push(`Ejecutando: ${trimmedQuery}`);
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Simular resultados según el contenido
          if (trimmedQuery.includes("'Hola Mundo'")) {
            output.push('| mensaje     |');
            output.push('|-------------|');
            output.push('| Hola Mundo  |');
          } else if (trimmedQuery.includes("'Bienvenido a CodeFarm'")) {
            output.push('| saludo                 |');
            output.push('|------------------------|');
            output.push('| Bienvenido a CodeFarm  |');
          } else if (trimmedQuery.includes('UNION')) {
            output.push('| numero |');
            output.push('|--------|');
            output.push('|   1    |');
            output.push('|   2    |');
            output.push('|   3    |');
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        else if (trimmedQuery.startsWith('INSERT') || 
                 trimmedQuery.startsWith('UPDATE') || 
                 trimmedQuery.startsWith('DELETE')) {
          output.push(`Ejecutando: ${trimmedQuery}`);
          output.push('Query OK, 1 row affected');
        }
        
        else if (trimmedQuery.startsWith('CREATE')) {
          output.push(`Ejecutando: ${trimmedQuery}`);
          output.push('Table created successfully');
        }
        
        else {
          errors.push(`Sintaxis no reconocida: ${trimmedQuery}`);
        }
      }
      
      if (errors.length === 0) {
        output.push('Todas las consultas ejecutadas exitosamente');
      }
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: 0
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de MySQL: ${error}`],
        success: false,
        executionTime: 0
      };
    }
  };

  return {
    executeCode,
    isExecuting,
    lastResult,
  };
};