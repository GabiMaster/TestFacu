import { AuthProvider } from '@/src/utils/contexts/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { LanguageProvider } from '../utils/contexts/LanguageContext';

export default function Layout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </AuthProvider>
  );
}