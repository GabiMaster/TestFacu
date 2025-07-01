import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
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
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);
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
      <Text style={getStyles(colors).resultLineContent} numberOfLines={1}>
        <Text style={getStyles(colors).normalText}>{before}</Text>
        <Text style={getStyles(colors).highlightedText}>{match}</Text>
        <Text style={getStyles(colors).normalText}>{after}</Text>
      </Text>
    );
  };

  // Contar total de coincidencias
  const totalMatches = searchResults.reduce((total, result) => total + result.matches.length, 0);

  return (
    <View style={getStyles(colors).container}>
      {/* Buscador */}
      <View style={getStyles(colors).searchContainer}>
        <View style={getStyles(colors).searchInputContainer}>
          <Icon name="magnify" size={moderateScale(18)} color={colors.icon} />
          <TextInput
            style={getStyles(colors).searchInput}
            value={searchText}
            onChangeText={handleSearchChange}
            placeholder="Buscar Texto"
            placeholderTextColor={colors.textSecondary}
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Icon name="close" size={moderateScale(18)} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de herramientas */}
      <View style={getStyles(colors).toolBar}>
        <TouchableOpacity style={getStyles(colors).toolButton}>
          <Icon name="format-letter-case" size={moderateScale(16)} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={getStyles(colors).toolButton}>
          <Icon name="format-text" size={moderateScale(16)} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={getStyles(colors).toolButton}>
          <Icon name="regex" size={moderateScale(16)} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={getStyles(colors).toolButton}>
          <Icon name="format-list-bulleted" size={moderateScale(16)} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={getStyles(colors).toolButton}>
          <Icon name="swap-horizontal" size={moderateScale(16)} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      <View style={getStyles(colors).resultsSection}>
        <View style={getStyles(colors).resultsHeader}>
          <Text style={getStyles(colors).resultsTitle}>RESULTADOS</Text>
          <View style={getStyles(colors).resultsActions}>
            <TouchableOpacity style={getStyles(colors).resultActionButton}>
              <Icon name="minus" size={moderateScale(16)} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={getStyles(colors).resultActionButton}>
              <Icon name="refresh" size={moderateScale(16)} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={getStyles(colors).resultActionButton}>
              <Icon name="close" size={moderateScale(16)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={getStyles(colors).resultsList} showsVerticalScrollIndicator={false}>
          {isSearching ? (
            <View style={getStyles(colors).loadingContainer}>
              <Text style={getStyles(colors).loadingText}>Buscando...</Text>
            </View>
          ) : searchText.trim() === '' ? (
            <View style={getStyles(colors).emptyContainer}>
              <Text style={getStyles(colors).emptyText}>Ingresa texto para buscar</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={getStyles(colors).emptyContainer}>
              <Text style={getStyles(colors).emptyText}>No se encontraron resultados</Text>
            </View>
          ) : (
            <>
              <Text style={getStyles(colors).summaryText}>
                {totalMatches} coincidencia{totalMatches !== 1 ? 's' : ''} en {searchResults.length} archivo{searchResults.length !== 1 ? 's' : ''}
              </Text>
              
              {searchResults.map((result) => (
                <View key={result.fileId} style={getStyles(colors).resultFile}>
                  <TouchableOpacity 
                    style={getStyles(colors).resultFileHeader}
                    onPress={() => handleSelectFile(result.fileId)}
                  >
                    <Icon name="file-document-outline" size={moderateScale(16)} color={colors.primary} />
                    <Text style={getStyles(colors).resultFileName}>{result.fileName}</Text>
                    <Text style={getStyles(colors).resultFileCount}>({result.matches.length})</Text>
                  </TouchableOpacity>
                  
                  {result.matches.map((match, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={[
                        getStyles(colors).resultLine,
                        match.lineNumber === 0 && getStyles(colors).fileNameMatch
                      ]}
                      onPress={() => handleSelectFile(result.fileId)}
                    >
                      <Text style={getStyles(colors).resultLineNumber}>
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: moderateScale(14),
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: scale(8),
  },
  toolButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsTitle: {
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    fontSize: moderateScale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  summaryText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.surface,
    gap: scale(8),
  },
  resultFileName: {
    color: colors.primary,
    fontSize: moderateScale(14),
    fontWeight: '500',
    flex: 1,
  },
  resultFileCount: {
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceLight,
  },
  resultLineNumber: {
    color: colors.textSecondary,
    fontSize: moderateScale(12),
    minWidth: moderateScale(30),
    textAlign: 'right',
  },
  resultLineContent: {
    flex: 1,
    fontSize: moderateScale(12),
  },
  normalText: {
    color: colors.textPrimary,
  },
  highlightedText: {
    color: colors.background,
    backgroundColor: colors.primary,
    fontWeight: 'bold',
  },
});