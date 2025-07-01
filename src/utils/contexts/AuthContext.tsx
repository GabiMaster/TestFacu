import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';


// Create a context for authentication with default values
type AuthContextType = {
    user: any;
    signIn: (username: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (data: Partial<any>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => {},
    signOut: async () => {},
    updateUser: async () => {},
});

// Provider component to wrap the application and provide auth context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    // Load user from AsyncStorage on initial render (searching for existing user session)
    useEffect(() => {
        const getUser = async () => {
            // Elimina el hardcodeo de testuser
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        };
        getUser();
    }, []);

    // Function to sign in a user
    const signIn = async (userData: any) => {
        // Si viene un string, parsea, si viene objeto, usa directo
        let userObj = userData;
        if (typeof userData === 'string') {
            try {
                userObj = JSON.parse(userData);
            } catch {
                userObj = { username: userData };
            }
        }
        setUser(userObj);
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
    };

    // Function to sign out the user
    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    // Function to update user data
    const updateUser = async (data: Partial<any>) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}