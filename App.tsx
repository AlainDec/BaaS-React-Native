import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './src/navigation/HomeStack';
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <NavigationContainer>
                <PaperProvider>
                    <HomeStack />
                </PaperProvider>
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default App;
