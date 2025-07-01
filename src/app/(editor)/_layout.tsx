import { COLOR } from '@/src/constants/colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function EditorLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={COLOR.surface} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'fade', // Transición suave entre vistas
        }}
      >
        <Stack.Screen 
          name="editor" 
          options={{
            title: 'Editor',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="home-redirect" 
          options={{
            title: 'Home Redirect',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}