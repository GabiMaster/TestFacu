import { Stack } from 'expo-router';
import React from 'react';

const EditorLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editor" />
      {/* Puedes agregar más pantallas aquí si las necesitas */}
    </Stack>
  );
};

export default EditorLayout;