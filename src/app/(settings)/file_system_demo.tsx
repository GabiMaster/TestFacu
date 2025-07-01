import { FileSystemDemo } from '@/src/components/demo/FileSystemDemo';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

export default function FileSystemDemoPage() {
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const styles = getStyles(COLOR);
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FileSystemDemo />
      </ScrollView>
    </View>
  );
}

function getStyles(COLOR: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
  });
}
