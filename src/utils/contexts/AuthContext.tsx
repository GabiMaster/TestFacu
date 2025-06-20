import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';


// Create a context for authentication with default values
type AuthContextType = {
    user: any;
    signIn: (username: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => {},
    signOut: async () => {},
});

// Provider component to wrap the application and provide auth context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    // Load user from AsyncStorage on initial render (searching for existing user session)
    useEffect(() => {
        const getUser = async () => {
            const hardCodedUser = {
                username: 'testuser',
                email: 'testuser@gmail.com',
            };
            await AsyncStorage.setItem('user', JSON.stringify(hardCodedUser)); // For testing purposes
            setUser(hardCodedUser);
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        };
        getUser();
    }, []);

    // Function to sign in a user
    const signIn = async (username: string) => {
        // Simulate an API call to authenticate the user
        setUser(username);
        await AsyncStorage.setItem('user', JSON.stringify(username));
    };

    // Function to sign out the user
    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}