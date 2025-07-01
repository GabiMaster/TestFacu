import { Icon } from '@/src/constants/icons';
import { getColorsByTheme } from '@/src/constants/themeColors';
import { useTheme } from '@/src/utils/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import React from 'react';

const Layout = () => {
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  
  return (
      <Tabs screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLOR.primary,
          tabBarInactiveTintColor: COLOR.icon,
          tabBarStyle: {
            backgroundColor: COLOR.surface,
            borderTopWidth: 0,
            height: 90,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 0, // Android shadow
            shadowOpacity: 0, // iOS shadow
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 4,
          },
          tabBarShowLabel: true,
      }}>
          <Tabs.Screen
              name="index"
              options={{
                  title: 'Inicio',
                  tabBarIcon: ({ color, size}) => <Icon name="home-outline" color={color} size={size} />
              }}
          />
          <Tabs.Screen
              name="projects"
              options={{
                  title: 'Proyectos',
                  tabBarIcon: ({ color, size}) => <Icon name="folder-outline" color={color} size={size} />
              }}
            />
          <Tabs.Screen
              name="settings"
              options={{
                  title: 'Configuración',
                  tabBarIcon: ({ color, size}) => <Icon name="cog-outline" color={color} size={size} />
              }}
          />
      </Tabs>
  );
};

export default Layout;