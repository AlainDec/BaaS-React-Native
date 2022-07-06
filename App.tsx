import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeStack from './src/navigation/HomeStack';
// Gestion du contexte du login
import { AuthProvider } from './src/navigation/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }} >
        <NavigationContainer>
          <HomeStack />
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default App;
