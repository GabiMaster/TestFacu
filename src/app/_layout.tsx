import { AuthProvider } from '@/src/utils/contexts/AuthContext';
import { SidebarProvider } from '@/src/utils/contexts/SidebarContext';
import { Stack } from 'expo-router';
import React from 'react';
import { LanguageProvider } from '../utils/contexts/LanguageContext';

export default function Layout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SidebarProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="(editor)" />
            <Stack.Screen name="(settings)" />
          </Stack>
        </SidebarProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}