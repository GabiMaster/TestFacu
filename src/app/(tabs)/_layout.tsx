import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';

const layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0066FF', tabBarInactiveTintColor: COLOR.icon }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, size}) => <Icon name="home-outline" color={color} size={size} />
            }}
        />
        <Tabs.Screen
            name="projects"
            options={{
                title: 'Projects',
                tabBarIcon: ({ color, size}) => <Icon name="folder-outline" color={color} size={size} />
            }}
        />
        <Tabs.Screen
            name="languages"
            options={{
                title: 'Languages',
                tabBarIcon: ({ color, size}) => <Icon name="file-code-outline" color={color} size={size} />
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color, size}) => <Icon name="cog-outline" color={color} size={size} />
            }}
        />
    </Tabs>
  );
};

export default layout;