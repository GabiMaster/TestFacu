// Formateadores de código para diferentes lenguajes

export interface FormatterOptions {
  indentSize?: number;
  useTabs?: boolean;
  maxLineLength?: number;
  insertFinalNewline?: boolean;
}

export interface FormatResult {
  formatted: string;
  changed: boolean;
  errors: string[];
}

// Clase base para formateadores
abstract class CodeFormatter {
  protected options: Required<FormatterOptions>;
  
  constructor(options: FormatterOptions = {}) {
    this.options = {
      indentSize: options.indentSize ?? 4,
      useTabs: options.useTabs ?? false,
      maxLineLength: options.maxLineLength ?? 100,
      insertFinalNewline: options.insertFinalNewline ?? true
    };
  }
  
  abstract format(code: string): FormatResult;
  
  protected getIndent(level: number): string {
    if (this.options.useTabs) {
      return '\t'.repeat(level);
    }
    return ' '.repeat(level * this.options.indentSize);
  }
  
  protected trimTrailingWhitespace(line: string): string {
    return line.replace(/\s+$/, '');
  }
  
  protected normalizeLineBreaks(code: string): string {
    return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }
}

// Formateador de Python
export class PythonFormatter extends CodeFormatter {
  format(code: string): FormatResult {
    const errors: string[] = [];
    const original = code;
    
    try {
      let formatted = this.normalizeLineBreaks(code);
      const lines = formatted.split('\n');
      const formattedLines: string[] = [];
      let indentLevel = 0;
      let inMultilineString = false;
      let stringDelimiter = '';
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const trimmed = line.trim();
        
        // Detectar strings multilínea
        if (!inMultilineString) {
          if (trimmed.includes('"""') || trimmed.includes("'''")) {
            inMultilineString = true;
            stringDelimiter = trimmed.includes('"""') ? '"""' : "'''";
          }
        } else {
          if (trimmed.includes(stringDelimiter)) {
            inMultilineString = false;
            stringDelimiter = '';
          }
        }
        
        // Si estamos en una string multilínea, no formatear
        if (inMultilineString) {
          formattedLines.push(line);
          continue;
        }
        
        // Líneas vacías o solo comentarios
        if (!trimmed || trimmed.startsWith('#')) {
          formattedLines.push(trimmed);
          continue;
        }
        
        // Decrementar indentación antes de la línea
        if (this.shouldDecreaseIndent(trimmed)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Aplicar indentación
        const indentedLine = this.getIndent(indentLevel) + trimmed;
        formattedLines.push(this.trimTrailingWhitespace(indentedLine));
        
        // Incrementar indentación después de la línea
        if (this.shouldIncreaseIndent(trimmed)) {
          indentLevel++;
        }
      }
      
      formatted = formattedLines.join('\n');
      
      // Agregar nueva línea final si es necesario
      if (this.options.insertFinalNewline && !formatted.endsWith('\n')) {
        formatted += '\n';
      }
      
      // Formatear imports
      formatted = this.formatImports(formatted);
      
      // Formatear espacios alrededor de operadores
      formatted = this.formatOperators(formatted);
      
      return {
        formatted,
        changed: formatted !== original,
        errors
      };
      
    } catch (error) {
      return {
        formatted: original,
        changed: false,
        errors: [`Error al formatear Python: ${error}`]
      };
    }
  }
  
  private shouldIncreaseIndent(line: string): boolean {
    return (
      line.endsWith(':') &&
      (line.startsWith('def ') ||
       line.startsWith('class ') ||
       line.startsWith('if ') ||
       line.startsWith('elif ') ||
       line.startsWith('else:') ||
       line.startsWith('for ') ||
       line.startsWith('while ') ||
       line.startsWith('try:') ||
       line.startsWith('except ') ||
       line.startsWith('finally:') ||
       line.startsWith('with '))
    );
  }
  
  private shouldDecreaseIndent(line: string): boolean {
    return (
      line.startsWith('elif ') ||
      line.startsWith('else:') ||
      line.startsWith('except ') ||
      line.startsWith('finally:')
    );
  }
  
  private formatImports(code: string): string {
    const lines = code.split('\n');
    const imports: string[] = [];
    const fromImports: string[] = [];
    const otherLines: string[] = [];
    let inImportSection = true;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('import ')) {
        if (inImportSection) {
          imports.push(trimmed);
        } else {
          otherLines.push(line);
        }
      } else if (trimmed.startsWith('from ')) {
        if (inImportSection) {
          fromImports.push(trimmed);
        } else {
          otherLines.push(line);
        }
      } else if (trimmed === '') {
        if (inImportSection && (imports.length > 0 || fromImports.length > 0)) {
          // Continuar en sección de imports
        } else {
          inImportSection = false;
          otherLines.push(line);
        }
      } else {
        inImportSection = false;
        otherLines.push(line);
      }
    }
    
    // Construir código reformateado
    const result: string[] = [];
    
    if (imports.length > 0) {
      result.push(...imports.sort());
      result.push('');
    }
    
    if (fromImports.length > 0) {
      result.push(...fromImports.sort());
      result.push('');
    }
    
    result.push(...otherLines);
    
    return result.join('\n');
  }
  
  private formatOperators(code: string): string {
    return code
      .replace(/([^=!<>])=([^=])/g, '$1 = $2')
      .replace(/([^=!<>])==([^=])/g, '$1 == $2')
      .replace(/([^=!<>])!=([^=])/g, '$1 != $2')
      .replace(/([^<])<=([^=])/g, '$1 <= $2')
      .replace(/([^>])>=([^=])/g, '$1 >= $2')
      .replace(/\+(?!\+)/g, ' + ')
      .replace(/-(?!-)/g, ' - ')
      .replace(/\*(?!\*)/g, ' * ')
      .replace(/\/(?!\/)/g, ' / ');
  }
}

// Formateador de JavaScript
export class JavaScriptFormatter extends CodeFormatter {
  format(code: string): FormatResult {
    const errors: string[] = [];
    const original = code;
    
    try {
      let formatted = this.normalizeLineBreaks(code);
      const lines = formatted.split('\n');
      const formattedLines: string[] = [];
      let indentLevel = 0;
      let inMultilineComment = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Detectar comentarios multilínea
        if (trimmed.includes('/*')) {
          inMultilineComment = true;
        }
        if (trimmed.includes('*/')) {
          inMultilineComment = false;
        }
        
        // Si estamos en comentario multilínea, mantener formato
        if (inMultilineComment) {
          formattedLines.push(line);
          continue;
        }
        
        // Líneas vacías o comentarios
        if (!trimmed || trimmed.startsWith('//')) {
          formattedLines.push(trimmed);
          continue;
        }
        
        // Decrementar antes de }
        if (trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Aplicar indentación
        const indentedLine = this.getIndent(indentLevel) + trimmed;
        formattedLines.push(this.trimTrailingWhitespace(indentedLine));
        
        // Incrementar después de {
        if (trimmed.endsWith('{')) {
          indentLevel++;
        }
        
        // Casos especiales
        if (trimmed.startsWith('} else') || trimmed.startsWith('} catch') || trimmed.startsWith('} finally')) {
          indentLevel++;
        }
      }
      
      formatted = formattedLines.join('\n');
      
      // Formatear espacios
      formatted = this.formatJavaScriptSpaces(formatted);
      
      // Insertar nueva línea final
      if (this.options.insertFinalNewline && !formatted.endsWith('\n')) {
        formatted += '\n';
      }
      
      return {
        formatted,
        changed: formatted !== original,
        errors
      };
      
    } catch (error) {
      return {
        formatted: original,
        changed: false,
        errors: [`Error al formatear JavaScript: ${error}`]
      };
    }
  }
  
  private formatJavaScriptSpaces(code: string): string {
    return code
      // Espacios alrededor de operadores
      .replace(/([^=!<>])=([^=])/g, '$1 = $2')
      .replace(/([^=!<>])==([^=])/g, '$1 == $2')
      .replace(/([^=!<>])===([^=])/g, '$1 === $2')
      .replace(/([^=!<>])!=([^=])/g, '$1 != $2')
      .replace(/([^=!<>])!==([^=])/g, '$1 !== $2')
      // Espacios después de palabras clave
      .replace(/\b(if|for|while|switch|catch)\(/g, '$1 (')
      // Espacios alrededor de llaves
      .replace(/\{/g, ' {')
      .replace(/\}/g, '} ')
      // Limpiar espacios múltiples
      .replace(/  +/g, ' ');
  }
}

// Formateador de Java
export class JavaFormatter extends CodeFormatter {
  format(code: string): FormatResult {
    const errors: string[] = [];
    const original = code;
    
    try {
      let formatted = this.normalizeLineBreaks(code);
      const lines = formatted.split('\n');
      const formattedLines: string[] = [];
      let indentLevel = 0;
      let inMultilineComment = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Comentarios multilínea
        if (trimmed.includes('/*')) inMultilineComment = true;
        if (trimmed.includes('*/')) inMultilineComment = false;
        
        if (inMultilineComment) {
          formattedLines.push(line);
          continue;
        }
        
        // Líneas vacías o comentarios
        if (!trimmed || trimmed.startsWith('//')) {
          formattedLines.push(trimmed);
          continue;
        }
        
        // Decrementar antes de }
        if (trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Aplicar indentación
        const indentedLine = this.getIndent(indentLevel) + trimmed;
        formattedLines.push(this.trimTrailingWhitespace(indentedLine));
        
        // Incrementar después de {
        if (trimmed.endsWith('{')) {
          indentLevel++;
        }
        
        // Casos especiales para Java
        if (trimmed.startsWith('} else') || 
            trimmed.startsWith('} catch') || 
            trimmed.startsWith('} finally')) {
          indentLevel++;
        }
      }
      
      formatted = formattedLines.join('\n');
      formatted = this.formatJavaSpaces(formatted);
      
      if (this.options.insertFinalNewline && !formatted.endsWith('\n')) {
        formatted += '\n';
      }
      
      return {
        formatted,
        changed: formatted !== original,
        errors
      };
      
    } catch (error) {
      return {
        formatted: original,
        changed: false,
        errors: [`Error al formatear Java: ${error}`]
      };
    }
  }
  
  private formatJavaSpaces(code: string): string {
    return code
      // Espacios alrededor de operadores
      .replace(/([^=!<>])=([^=])/g, '$1 = $2')
      .replace(/([^=!<>])==([^=])/g, '$1 == $2')
      .replace(/([^=!<>])!=([^=])/g, '$1 != $2')
      // Espacios después de palabras clave
      .replace(/\b(if|for|while|switch|catch|synchronized)\(/g, '$1 (')
      // Espacios después de comas
      .replace(/,(?!\s)/g, ', ')
      // Espacios alrededor de llaves
      .replace(/\{(?!\s)/g, '{ ')
      .replace(/(?<!\s)\}/g, ' }');
  }
}

// Factory para formateadores
export class FormatterFactory {
  static createFormatter(language: string, options?: FormatterOptions): CodeFormatter {
    switch (language.toLowerCase()) {
      case 'python':
        return new PythonFormatter(options);
      case 'javascript':
      case 'js':
        return new JavaScriptFormatter(options);
      case 'java':
        return new JavaFormatter(options);
      default:
        throw new Error(`Formateador no disponible para: ${language}`);
    }
  }
  
  static getSupportedLanguages(): string[] {
    return ['python', 'javascript', 'java'];
  }
}

// Función principal para formatear código
export function formatCode(
  code: string, 
  language: string, 
  options?: FormatterOptions
): FormatResult {
  try {
    const formatter = FormatterFactory.createFormatter(language, options);
    return formatter.format(code);
  } catch (error) {
    return {
      formatted: code,
      changed: false,
      errors: [`Error al crear formateador: ${error}`]
    };
  }
}

// Funciones de utilidad
export function formatCodeBasic(code: string): string {
  const lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 2;
  
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrementar antes de }
      if (trimmed === '}' || trimmed.startsWith('} ') || trimmed === '});') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indent = ' '.repeat(indentLevel * indentSize);
      
      // Incrementar después de {
      if (trimmed.endsWith('{') || 
          (trimmed.includes('if(') && trimmed.endsWith('{'))) {
        indentLevel++;
      }
      
      return indent + trimmed;
    })
    .join('\n');
}

export function removeExtraWhitespace(code: string): string {
  return code
    .replace(/[ \t]+$/gm, '') // Eliminar espacios al final de línea
    .replace(/\n{3,}/g, '\n\n') // Máximo 2 líneas vacías consecutivas
    .replace(/^[ \t]+$/gm, ''); // Eliminar líneas con solo espacios
}

export function addMissingBraces(code: string, language: string): string {
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'java') {
    // Implementación básica para agregar llaves faltantes
    const lines = code.split('\n');
    const result: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      result.push(lines[i]);
      
      // Si es una declaración if/for/while sin llaves
      if ((line.startsWith('if ') || line.startsWith('for ') || line.startsWith('while ')) &&
          !line.endsWith('{') && line.endsWith(')')) {
        result[result.length - 1] = lines[i] + ' {';
        
        // Buscar la siguiente línea no vacía
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length && !lines[nextLineIndex].trim()) {
          result.push(lines[nextLineIndex]);
          nextLineIndex++;
        }
        
        if (nextLineIndex < lines.length) {
          result.push(lines[nextLineIndex]);
          result.push(lines[nextLineIndex].replace(/^(\s*)/, '$1}'));
          i = nextLineIndex;
        }
      }
    }
    
    return result.join('\n');
  }
  
  return code;
}