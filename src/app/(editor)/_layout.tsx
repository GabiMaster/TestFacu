import { COLOR } from '@/src/constants/colors';
import { SidebarProvider } from '@/src/utils/contexts/SidebarContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function EditorLayout() {
  return (
    <SidebarProvider>
      <StatusBar style="light" backgroundColor={COLOR.surface} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="editor" 
          options={{
            title: 'Editor',
            headerShown: false,
          }}
        />
      </Stack>
    </SidebarProvider>
  );
}