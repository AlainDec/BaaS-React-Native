import React from 'react';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './src/navigation/HomeStack';
// Gestion du contexte du login
import { AuthProvider } from './src/navigation/AuthProvider';
// Firebase
import auth from '@react-native-firebase/auth';

const App = () => {

/*
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

    React.useEffect(() => {
        let userAuth = auth().currentUser;
        console.log(userAuth?.uid);
        userAuth && setUserLoggedIn(false);
    }, [])

    const handleCallback = (childData) => {
        setUserLoggedIn(childData);
    }
*/
//auth={userLoggedIn}
    return (
        <AuthProvider>
            <SafeAreaView style={{ flex: 1 }} >
                <NavigationContainer>
                    <HomeStack   />
                </NavigationContainer>
            </SafeAreaView>
        </AuthProvider>
    );
};

export default App;
