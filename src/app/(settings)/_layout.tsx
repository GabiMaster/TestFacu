import { Stack } from 'expo-router';
import React from 'react';

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="contactanos" />
      <Stack.Screen name="cambiar_contrasena" />
      <Stack.Screen name="language_selector" />
      <Stack.Screen name="politicas_privacidad" />
    </Stack>
  );
};

export default SettingsLayout;