import { useAuth } from '@/src/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const Index = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true)
    console.log('User:', user);

    useEffect(() => {
        AsyncStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const prepare = async () => {
            // Wait a bit before showing the app
            await new Promise((res) => setTimeout(res, 3000)) // Simulate loading for 3 seconds
            await SplashScreen.hideAsync();
            setLoading(false);
        }
        prepare();
    }, []);

    if (loading) return null

    return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
};

export default Index;