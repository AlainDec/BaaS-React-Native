import React from 'react';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './src/navigation/HomeStack';
// Gestion du contexte du login
import { AuthProvider } from './src/navigation/AuthProvider';
// Firebase
import auth from '@react-native-firebase/auth';
// React native paper
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {

    return (
        <AuthProvider>
            <SafeAreaView style={{ flex: 1 }} >
                <NavigationContainer>
                    <PaperProvider>
                        <HomeStack />
                    </PaperProvider>
                </NavigationContainer>
            </SafeAreaView>
        </AuthProvider>
    );
};

export default App;
