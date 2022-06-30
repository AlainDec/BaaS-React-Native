import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeStack from './src/navigation/HomeStack';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
