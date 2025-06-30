// Ejecutores de código para diferentes lenguajes

export interface ExecutionResult {
  output: string[];
  errors: string[];
  success: boolean;
  executionTime: number;
}

export interface ExecutionContext {
  language: string;
  code: string;
  timeout?: number;
}

// Clase base para ejecutores
abstract class CodeExecutor {
  protected timeout: number;
  
  constructor(timeout: number = 10000) {
    this.timeout = timeout;
  }
  
  abstract execute(code: string): Promise<ExecutionResult>;
  
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  protected parseVariables(content: string, variables: Record<string, any>): string {
    let result = content;
    
    // Reemplazar variables en f-strings o template literals
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}|\\$\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }
}

// Ejecutor de Python
export class PythonExecutor extends CodeExecutor {
  private variables: Record<string, any> = {
    nombre: 'CodeFarm',
    usuario: 'Desarrollador',
    version: '1.0.0'
  };
  
  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      await this.delay(600);
      
      const lines = code.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        await this.processLine(line.trim(), output, errors);
        await this.delay(100);
      }
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error inesperado: ${error}`],
        success: false,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  private async processLine(line: string, output: string[], errors: string[]): Promise<void> {
    // Print statements
    if (line.startsWith('print(')) {
      const match = line.match(/print\((.*)\)/);
      if (match) {
        let content = match[1];
        
        // Manejar f-strings
        if (content.includes('f"') || content.includes("f'")) {
          content = content.replace(/f["'](.*)["']/, '$1');
          content = this.parseVariables(content, this.variables);
        }
        
        // Remover comillas
        content = content.replace(/^["']|["']$/g, '');
        output.push(content);
      }
    }
    
    // Variable assignments
    else if (line.includes('=') && !line.includes('==')) {
      const [varName, varValue] = line.split('=').map(s => s.trim());
      if (varValue.startsWith('"') || varValue.startsWith("'")) {
        this.variables[varName] = varValue.replace(/["']/g, '');
      } else if (!isNaN(Number(varValue))) {
        this.variables[varName] = Number(varValue);
      }
    }
    
    // For loops
    else if (line.startsWith('for ') && line.includes('range(')) {
      const rangeMatch = line.match(/range\((\d+)\)/);
      if (rangeMatch) {
        const count = parseInt(rangeMatch[1]);
        const varMatch = line.match(/for (\w+) in/);
        const iterVar = varMatch?.[1] || 'i';
        
        for (let i = 0; i < count; i++) {
          this.variables[iterVar] = i;
          await this.delay(50);
        }
      }
    }
    
    // If statements (básico)
    else if (line.startsWith('if ')) {
      // Simulación básica - siempre evalúa como true
      output.push('Condición evaluada');
    }
    
    // Import statements
    else if (line.startsWith('import ')) {
      output.push(`Módulo importado: ${line.replace('import ', '')}`);
    }
    
    // Errores simulados
    else if (line.includes('undefined_var')) {
      errors.push("NameError: name 'undefined_var' is not defined");
    }
  }
}

// Ejecutor de JavaScript
export class JavaScriptExecutor extends CodeExecutor {
  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      await this.delay(400);
      
      // Mock console
      const mockConsole = {
        log: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          output.push(message);
        },
        error: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          errors.push(message);
        },
        warn: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          output.push(`⚠️ ${message}`);
        }
      };
      
      // Evaluar código de forma segura
      const safeCode = this.sanitizeJavaScript(code);
      const func = new Function('console', 'setTimeout', 'setInterval', safeCode);
      
      // Mock setTimeout para que sea síncrono en la simulación
      const mockSetTimeout = (callback: Function, delay: number) => {
        callback();
      };
      
      func(mockConsole, mockSetTimeout, mockSetTimeout);
      
      return {
        output,
        errors,
        success: errors.length === 0,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de JavaScript: ${error}`],
        success: false,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  private sanitizeJavaScript(code: string): string {
    // Remover código potencialmente peligroso
    const dangerous = [
      'eval',
      'Function',
      'window',
      'document',
      'global',
      'process',
      'require',
      '__dirname',
      '__filename'
    ];
    
    let sanitized = code;
    dangerous.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      sanitized = sanitized.replace(regex, `_blocked_${keyword}_`);
    });
    
    return sanitized;
  }
}

// Ejecutor de Java
export class JavaExecutor extends CodeExecutor {
  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    
    try {
      output.push('Compilando código Java...');
      await this.delay(800);
      
      // Verificar sintaxis básica
      if (!code.includes('public class')) {
        errors.push('Error: Debe definir una clase pública');
        return { output, errors, success: false, executionTime: Date.now() - startTime };
      }
      
      if (!code.includes('public static void main')) {
        errors.push('Error: Debe definir el método main');
        return { output, errors, success: false, executionTime: Date.now() - startTime };
      }
      
      output.push('Compilación exitosa');
      output.push('Ejecutando...');
      await this.delay(300);
      
      // Procesar System.out.println
      const printMatches = code.match(/System\.out\.println\((.*?)\);/g);
      if (printMatches) {
        for (const match of printMatches) {
          const content = match.match(/System\.out\.println\((.*?)\);/)?.[1];
          if (content) {
            let message = content.replace(/"/g, '');
            
            // Manejar concatenación simple
            if (message.includes(' + ')) {
              message = message.replace(/ \+ /g, '');
              message = message.replace(/\w+/g, (word) => {
                const variables: Record<string, string> = {
                  'nombre': 'CodeFarm',
                  'version': '1.0'
                };
                return variables[word] || word;
              });
            }
            
            output.push(message);
            await this.delay(100);
          }
        }
      }
      
      // Procesar loops for básicos
      if (code.includes('for(int i')) {
        const forMatch = code.match(/for\(int i\s*=\s*(\d+);\s*i\s*<\s*(\d+);/);
        if (forMatch) {
          const start = parseInt(forMatch[1]);
          const end = parseInt(forMatch[2]);
          
          for (let i = start; i < end; i++) {
            output.push(`Iteración: ${i}`);
            await this.delay(50);
          }
        }
      }
      
      return {
        output,
        errors,
        success: true,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        output,
        errors: [`Error de Java: ${error}`],
        success: false,
        executionTime: Date.now() - startTime
      };
    }
  }
}

// Factory para crear ejecutores
export class ExecutorFactory {
  static createExecutor(language: string, timeout?: number): CodeExecutor {
    switch (language.toLowerCase()) {
      case 'python':
        return new PythonExecutor(timeout);
      case 'javascript':
      case 'js':
        return new JavaScriptExecutor(timeout);
      case 'java':
        return new JavaExecutor(timeout);
      default:
        throw new Error(`Lenguaje no soportado: ${language}`);
    }
  }
  
  static getSupportedLanguages(): string[] {
    return ['python', 'javascript', 'java'];
  }
}

// Función principal para ejecutar código
export async function executeCode(
  context: ExecutionContext
): Promise<ExecutionResult> {
  try {
    const executor = ExecutorFactory.createExecutor(context.language, context.timeout);
    return await executor.execute(context.code);
  } catch (error) {
    return {
      output: [],
      errors: [`Error al crear ejecutor: ${error}`],
      success: false,
      executionTime: 0
    };
  }
}