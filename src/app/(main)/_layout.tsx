import { Stack } from 'expo-router';
import React from 'react';

const MainLayout = () => {
  return (
    <Stack screenOptions={{ animation: 'fade' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new_project" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;