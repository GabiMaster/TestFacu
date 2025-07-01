import { FileSystemDemo } from '@/src/components/demo/FileSystemDemo';
import { COLOR } from '@/src/constants/colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function FileSystemDemoPage() {
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

const styles = StyleSheet.create({
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
