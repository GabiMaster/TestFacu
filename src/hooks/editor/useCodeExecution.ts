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
  }, [isExecuting, onOutput]);

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

  // Simulador de JavaScript
  const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const output: string[] = [];
    const errors: string[] = [];
    
    // Mock console para capturar logs
    const mockConsole = {
      log: (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        output.push(message);
      },
      error: (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        errors.push(message);
      }
    };

    try {
      // Reemplazar console con nuestro mock
      const safeCode = code.replace(/console\./g, 'mockConsole.');
      
      // Crear función y ejecutar
      const func = new Function('mockConsole', safeCode);
      func(mockConsole);
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: 0
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de JavaScript: ${error}`],
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

  // Simulador de HTML
  const executeHtml = async (code: string): Promise<ExecutionResult> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const output: string[] = [];
    
    output.push('HTML renderizado exitosamente');
    output.push('Elementos encontrados:');
    
    // Analizar elementos HTML
    const titleMatch = code.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      output.push(`- Título: ${titleMatch[1]}`);
    }
    
    const h1Match = code.match(/<h1>(.*?)<\/h1>/);
    if (h1Match) {
      output.push(`- Encabezado H1: ${h1Match[1]}`);
    }
    
    const pMatches = code.match(/<p>(.*?)<\/p>/g);
    if (pMatches) {
      pMatches.forEach((match, index) => {
        const content = match.match(/<p>(.*?)<\/p>/)?.[1];
        output.push(`- Párrafo ${index + 1}: ${content}`);
      });
    }
    
    return {
      output,
      errors: [],
      success: true,
      executionTime: 0
    };
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