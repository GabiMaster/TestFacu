import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { FileSystemManager } from '@/src/utils/fileSystem/FileSystemManager';
import { getDefaultContentByFileName } from '@/src/utils/fileSystem/defaultFileContents';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SearchResult {
  fileId: string;
  fileName: string;
  filePath: string;
  matches: {
    lineNumber: number;
    lineContent: string;
    matchStart: number;
    matchEnd: number;
  }[];
}

interface SidebarSearchViewProps {
  onClose: () => void;
}

export const SidebarSearchView: React.FC<SidebarSearchViewProps> = ({ onClose }) => {
  const { files, selectFile } = useSidebarContext();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Función para buscar en todos los archivos
  const searchInAllFiles = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Función recursiva para buscar en archivos
    const searchInFileTree = async (items: typeof files) => {
      for (const item of items) {
        if (item.type === 'file') {
          try {
            let matches: SearchResult['matches'] = [];
            
            // Buscar en el nombre del archivo
            const fileName = item.name.toLowerCase();
            if (fileName.includes(lowerQuery)) {
              matches.push({
                lineNumber: 0, // 0 indica que es una coincidencia en el nombre del archivo
                lineContent: `📄 ${item.name}`,
                matchStart: fileName.indexOf(lowerQuery),
                matchEnd: fileName.indexOf(lowerQuery) + query.length
              });
            }

            // Cargar el contenido real del archivo y buscar en el contenido
            let content = await FileSystemManager.loadFileContent(item.id);
            console.log(`🔍 Searching in file ${item.name} (ID: ${item.id}), content length: ${content?.length || 0}`);
            
            // Si no hay contenido guardado, usar contenido por defecto
            if (!content || content.trim() === '') {
              content = getDefaultContentByFileName(item.name);
              console.log(`🔧 Using default content for ${item.name}, length: ${content.length}`);
            }
            
            if (content && content.trim()) {
              const lines = content.split('\n');

              lines.forEach((line, lineIndex) => {
                const lowerLine = line.toLowerCase();
                let searchIndex = 0;

                while (true) {
                  const matchIndex = lowerLine.indexOf(lowerQuery, searchIndex);
                  if (matchIndex === -1) break;

                  matches.push({
                    lineNumber: lineIndex + 1,
                    lineContent: line.trim(),
                    matchStart: matchIndex,
                    matchEnd: matchIndex + query.length
                  });

                  searchIndex = matchIndex + 1;
                }
              });
            }

            // Si hay coincidencias, agregar el archivo a los resultados
            if (matches.length > 0) {
              results.push({
                fileId: item.id,
                fileName: item.name,
                filePath: item.path,
                matches
              });
            }
          } catch (error) {
            console.error(`Error loading content for file ${item.name}:`, error);
            
            // Si no se puede cargar el contenido, al menos buscar en el nombre
            const fileName = item.name.toLowerCase();
            if (fileName.includes(lowerQuery)) {
              results.push({
                fileId: item.id,
                fileName: item.name,
                filePath: item.path,
                matches: [{
                  lineNumber: 0,
                  lineContent: `📄 ${item.name}`,
                  matchStart: fileName.indexOf(lowerQuery),
                  matchEnd: fileName.indexOf(lowerQuery) + query.length
                }]
              });
            }
          }
        }

        if (item.children) {
          await searchInFileTree(item.children);
        }
      }
    };

    await searchInFileTree(files);
    setSearchResults(results);
    setIsSearching(false);
  }, [files]);

  // Handler para cambios en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    searchInAllFiles(text);
  };

  // Handler para seleccionar un archivo desde los resultados
  const handleSelectFile = (fileId: string) => {
    const file = findFileById(files, fileId);
    if (file) {
      selectFile(file);
      onClose(); // Cerrar sidebar después de seleccionar archivo
    }
  };

  // Función auxiliar para encontrar archivo por ID
  const findFileById = (items: typeof files, id: string): typeof files[0] | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFileById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Renderizar línea con highlights
  const renderHighlightedLine = (line: string, matchStart: number, matchEnd: number) => {
    const before = line.substring(0, matchStart);
    const match = line.substring(matchStart, matchEnd);
    const after = line.substring(matchEnd);

    return (
      <Text style={styles.resultLineContent} numberOfLines={1}>
        <Text style={styles.normalText}>{before}</Text>
        <Text style={styles.highlightedText}>{match}</Text>
        <Text style={styles.normalText}>{after}</Text>
      </Text>
    );
  };

  // Contar total de coincidencias
  const totalMatches = searchResults.reduce((total, result) => total + result.matches.length, 0);

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="magnify" size={moderateScale(18)} color={COLOR.icon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearchChange}
            placeholder="Buscar Texto"
            placeholderTextColor={COLOR.textSecondary}
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Icon name="close" size={moderateScale(18)} color={COLOR.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de herramientas */}
      <View style={styles.toolBar}>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="format-letter-case" size={moderateScale(16)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="format-text" size={moderateScale(16)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="regex" size={moderateScale(16)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="format-list-bulleted" size={moderateScale(16)} color={COLOR.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="swap-horizontal" size={moderateScale(16)} color={COLOR.icon} />
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>RESULTADOS</Text>
          <View style={styles.resultsActions}>
            <TouchableOpacity style={styles.resultActionButton}>
              <Icon name="minus" size={moderateScale(16)} color={COLOR.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultActionButton}>
              <Icon name="refresh" size={moderateScale(16)} color={COLOR.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultActionButton}>
              <Icon name="close" size={moderateScale(16)} color={COLOR.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Buscando...</Text>
            </View>
          ) : searchText.trim() === '' ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ingresa texto para buscar</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron resultados</Text>
            </View>
          ) : (
            <>
              <Text style={styles.summaryText}>
                {totalMatches} coincidencia{totalMatches !== 1 ? 's' : ''} en {searchResults.length} archivo{searchResults.length !== 1 ? 's' : ''}
              </Text>
              
              {searchResults.map((result) => (
                <View key={result.fileId} style={styles.resultFile}>
                  <TouchableOpacity 
                    style={styles.resultFileHeader}
                    onPress={() => handleSelectFile(result.fileId)}
                  >
                    <Icon name="file-document-outline" size={moderateScale(16)} color={COLOR.primary} />
                    <Text style={styles.resultFileName}>{result.fileName}</Text>
                    <Text style={styles.resultFileCount}>({result.matches.length})</Text>
                  </TouchableOpacity>
                  
                  {result.matches.map((match, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={[
                        styles.resultLine,
                        match.lineNumber === 0 && styles.fileNameMatch
                      ]}
                      onPress={() => handleSelectFile(result.fileId)}
                    >
                      <Text style={styles.resultLineNumber}>
                        {match.lineNumber === 0 ? '📄' : match.lineNumber}
                      </Text>
                      {renderHighlightedLine(match.lineContent, match.matchStart, match.matchEnd)}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  searchContainer: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surfaceLight,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
    gap: scale(8),
  },
  toolButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: COLOR.surface,
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    backgroundColor: COLOR.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  resultsTitle: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resultsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  resultActionButton: {
    padding: moderateScale(4),
    borderRadius: moderateScale(4),
  },
  resultsList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  loadingText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  emptyText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  summaryText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
  },
  resultFile: {
    marginBottom: verticalScale(8),
  },
  resultFileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    backgroundColor: COLOR.surface,
    gap: scale(8),
  },
  resultFileName: {
    color: COLOR.primary,
    fontSize: moderateScale(14),
    fontWeight: '500',
    flex: 1,
  },
  resultFileCount: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
  },
  resultLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(4),
    gap: scale(12),
  },
  fileNameMatch: {
    backgroundColor: COLOR.surfaceLight,
  },
  resultLineNumber: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(12),
    minWidth: moderateScale(30),
    textAlign: 'right',
  },
  resultLineContent: {
    flex: 1,
    fontSize: moderateScale(12),
  },
  normalText: {
    color: COLOR.textPrimary,
  },
  highlightedText: {
    color: COLOR.background,
    backgroundColor: COLOR.primary,
    fontWeight: 'bold',
  },
});