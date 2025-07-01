import { Stack } from 'expo-router';
import React from 'react';

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Transición suave entre vistas
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="notificaciones" />
      <Stack.Screen name="mensajes" />
      <Stack.Screen name="contactanos" />
      <Stack.Screen name="cambiar_contrasena" />
      <Stack.Screen name="language_selector" />
      <Stack.Screen name="politicas_privacidad" />
    </Stack>
  );
};

export default SettingsLayout;