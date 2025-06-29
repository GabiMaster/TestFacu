import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';

const layout = () => {
  return (
      <Tabs screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLOR.primary,
          tabBarInactiveTintColor: COLOR.icon,
          tabBarStyle: {
            backgroundColor: COLOR.surfaceLight,
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
              name="languages"
              options={{
                  title: 'Lenguajes',
                  tabBarIcon: ({ color, size}) => <Icon name="file-code-outline" color={color} size={size} />
              }}
          />
          <Tabs.Screen
              name="settings"
              options={{
                  title: 'Configuración',
                  tabBarIcon: ({ color, size}) => <Icon name="cog-outline" color={color} size={size} />
              }}
          />
          <Tabs.Screen name="profile" options={{ href: null }} />
          <Tabs.Screen name="edit_personal_info" options={{ href: null }} />
          <Tabs.Screen name="logout" options={{ href: null }} />
          <Tabs.Screen name="contactanos" options={{ href: null }} />
          <Tabs.Screen name="cambiar_contrasena" options={{ href: null }} />
          <Tabs.Screen name="language_selector" options={{ href: null }} />
          <Tabs.Screen name="politicas_privacidad" options={{ href: null }} />

      </Tabs>
  );
};

export default layout;