import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface ConsoleMessage {
  id: string;
  type: 'output' | 'error' | 'input' | 'system';
  content: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  language?: string;
  onToggle: () => void;
  onClear: () => void;
  code?: string;
  isExecuting?: boolean;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  language,
  onToggle,
  onClear,
  code = '',
  isExecuting = false,
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const messageIdCounter = useRef(0);

  // Función para agregar mensaje a la consola
  const addMessage = (content: string, type: ConsoleMessage['type'] = 'output') => {
    messageIdCounter.current += 1;
    const newMessage: ConsoleMessage = {
      id: `msg-${messageIdCounter.current}-${Date.now()}`,
      type,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll al final
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Función para limpiar la consola
  const handleClear = () => {
    setMessages([]);
    messageIdCounter.current = 0;
    onClear();
  };

  // Ejecutar código cuando se recibe código nuevo
  useEffect(() => {
    if (code && code.trim()) {
      executeCode(code, language || 'Código');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language]);

  // Simuladores de ejecución por lenguaje
  const executeCode = async (codeToExecute: string, lang: string) => {
    addMessage(`> Ejecutando ${lang}...`, 'system');
    
    try {
      switch (lang) {
        case 'Python':
          await executePython(codeToExecute);
          break;
        case 'JavaScript':
          await executeJavaScript(codeToExecute);
          break;
        case 'Java':
          await executeJava(codeToExecute);
          break;
        case 'Html':
        case 'HTML':
          await executeHtml(codeToExecute);
          break;
        case 'MySQL':
        case 'SQL':
          await executeMySQL(codeToExecute);
          break;
        case 'Código':
        default:
          // Para lenguajes no reconocidos, intentar ejecutar como JavaScript
          addMessage('Ejecutando código...', 'system');
          await executeJavaScript(codeToExecute);
      }
    } catch (error) {
      addMessage(`Error: ${error}`, 'error');
    }
  };

  // Simulador de ejecución de Python
  const executePython = async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lines = code.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.trim().startsWith('print(')) {
        const match = line.match(/print\((.*)\)/);
        if (match) {
          let content = match[1];
          
          // Simular f-strings y variables
          if (content.includes('f"') || content.includes("f'")) {
            content = content.replace(/f["'](.*)["']/, '$1');
            content = content.replace(/{([^}]+)}/g, (_, variable) => {
              if (variable === 'nombre') return 'CodeFarm';
              if (variable === 'i') return Math.floor(Math.random() * 3).toString();
              return variable;
            });
          }
          
          content = content.replace(/["']/g, '');
          addMessage(content, 'output');
        }
      } else if (line.includes('for i in range(')) {
        const match = line.match(/range\((\d+)\)/);
        if (match) {
          const count = parseInt(match[1]);
          for (let i = 0; i < count; i++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            addMessage(`Número: ${i}`, 'output');
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  // Simulador de ejecución de JavaScript
  const executeJavaScript = async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockConsole = {
      log: (...args: any[]) => {
        const output = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        addMessage(output, 'output');
      },
      error: (...args: any[]) => {
        const output = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        addMessage(output, 'error');
      }
    };

    try {
      const safeCode = code.replace(/console\./g, 'mockConsole.');
      const func = new Function('mockConsole', safeCode);
      func(mockConsole);
    } catch (error) {
      addMessage(`Error de JavaScript: ${error}`, 'error');
    }
  };

  // Simulador de ejecución de Java
  const executeJava = async (code: string) => {
    addMessage('Compilando...', 'system');
    await new Promise(resolve => setTimeout(resolve, 800));
    addMessage('Compilación exitosa', 'system');
    await new Promise(resolve => setTimeout(resolve, 300));
    addMessage('Ejecutando...', 'system');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (code.includes('System.out.println')) {
      const matches = code.match(/System\.out\.println\s*\(\s*([^)]+)\s*\)\s*;/g);
      if (matches) {
        for (const match of matches) {
          const contentMatch = match.match(/System\.out\.println\s*\(\s*([^)]+)\s*\)\s*;/);
          if (contentMatch && contentMatch[1]) {
            let output = contentMatch[1].trim();
            
            // Remover comillas externas
            output = output.replace(/^["']|["']$/g, '');
            
            // Manejar concatenación con +
            if (output.includes(' + ')) {
              // Procesar concatenación simple como "Bienvenido a " + nombre
              output = output.replace(/"([^"]*)" \+ ([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, str, variable) => {
                if (variable === 'nombre') return str + 'CodeFarm';
                if (variable === 'i') return str + Math.floor(Math.random() * 3);
                return str + variable;
              });
              
              // Procesar concatenación con variables al inicio
              output = output.replace(/([a-zA-Z_][a-zA-Z0-9_]*) \+ "([^"]*)"/g, (match, variable, str) => {
                if (variable === 'nombre') return 'CodeFarm' + str;
                return variable + str;
              });
            }
            
            addMessage(output, 'output');
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    }
    
    // Procesar bucles for
    if (code.includes('for(int i')) {
      const forLoopMatch = code.match(/for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\+\+\s*\)/);
      if (forLoopMatch) {
        const start = parseInt(forLoopMatch[1]);
        const end = parseInt(forLoopMatch[2]);
        
        for (let i = start; i < end; i++) {
          addMessage(`Número: ${i}`, 'output');
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
    
    addMessage('Programa terminado exitosamente', 'system');
  };

  // Simulador de ejecución de HTML
  const executeHtml = async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    addMessage('HTML renderizado exitosamente', 'system');
    addMessage('Elementos encontrados:', 'output');
    
    const titleMatch = code.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      addMessage(`- Título: ${titleMatch[1]}`, 'output');
    }
    
    const h1Match = code.match(/<h1>(.*?)<\/h1>/);
    if (h1Match) {
      addMessage(`- Encabezado H1: ${h1Match[1]}`, 'output');
    }
    
    const pMatch = code.match(/<p>(.*?)<\/p>/);
    if (pMatch) {
      addMessage(`- Párrafo: ${pMatch[1]}`, 'output');
    }
  };

  // Simulador de ejecución de MySQL
  const executeMySQL = async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    addMessage('Conectando a la base de datos...', 'system');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const queries = code.split(';').filter(q => q.trim());
    
    for (const query of queries) {
      if (query.trim().startsWith('SELECT')) {
        addMessage(`Ejecutando: ${query.trim()}`, 'system');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (query.includes("'Hola Mundo'")) {
          addMessage('mensaje: Hola Mundo', 'output');
        } else if (query.includes("'Bienvenido a CodeFarm'")) {
          addMessage('saludo: Bienvenido a CodeFarm', 'output');
        } else if (query.includes('UNION')) {
          addMessage('numero: 1', 'output');
          addMessage('numero: 2', 'output');
          addMessage('numero: 3', 'output');
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    addMessage('Consultas ejecutadas exitosamente', 'system');
  };

  return (
    <View style={styles.consoleSection}>
      <View style={styles.consoleHeader}>
        <Text style={styles.consoleTitle}>Consola</Text>
        <View style={styles.consoleActions}>
          <TouchableOpacity 
            style={styles.consoleActionButton} 
            onPress={handleClear}
          >
            <Icon name="broom" size={moderateScale(16)} color={COLOR.icon} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.consoleActionButton} 
            onPress={onToggle}
          >
            <Icon name="close" size={moderateScale(16)} color={COLOR.icon} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        ref={scrollRef}
        style={styles.consoleContent}
        contentContainerStyle={{ paddingVertical: verticalScale(8) }}
        showsVerticalScrollIndicator={true}
      >
        {messages.length === 0 ? (
          <Text style={styles.consoleEmptyMessage}>
            Presiona el botón &quot;Run&quot; para ejecutar tu código
          </Text>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.consoleMessage}>
              <Text style={[
                styles.consoleMessageText,
                message.type === 'error' && styles.consoleErrorText,
                message.type === 'system' && styles.consoleSystemText,
                message.type === 'input' && styles.consoleInputText,
              ]}>
                {message.content}
              </Text>
              <Text style={styles.consoleTimestamp}>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
        
        {isExecuting && (
          <View style={styles.consoleMessage}>
            <Text style={styles.consoleSystemText}>Ejecutando...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  consoleSection: {
    flex: 0.4,
    backgroundColor: COLOR.surfaceDark,
    borderTopWidth: 2,
    borderTopColor: COLOR.border,
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: COLOR.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  consoleTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  consoleActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  consoleActionButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: COLOR.surfaceLight,
  },
  consoleContent: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
  },
  consoleEmptyMessage: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  consoleMessage: {
    marginBottom: verticalScale(4),
    paddingVertical: verticalScale(2),
  },
  consoleMessageText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(12),
    fontFamily: 'monospace',
    lineHeight: moderateScale(16),
  },
  consoleErrorText: {
    color: COLOR.error,
  },
  consoleSystemText: {
    color: COLOR.textSecondary,
    fontStyle: 'italic',
  },
  consoleInputText: {
    color: COLOR.primary,
  },
  consoleTimestamp: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(10),
    marginTop: verticalScale(2),
  },
});