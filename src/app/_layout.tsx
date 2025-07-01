import { AuthProvider } from '@/src/utils/contexts/AuthContext';
import { SidebarProvider } from '@/src/utils/contexts/SidebarContext';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getColorsByTheme } from '../constants/themeColors';
import { LanguageProvider } from '../utils/contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../utils/contexts/ThemeContext';

// Componente que aplica el fondo dinámico según el tema
function LayoutContainer({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {children}
    </View>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <SidebarProvider>
            <LayoutContainer>
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(main)" />
                <Stack.Screen name="(editor)" />
                <Stack.Screen name="(settings)" />
              </Stack>
            </LayoutContainer>
          </SidebarProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});