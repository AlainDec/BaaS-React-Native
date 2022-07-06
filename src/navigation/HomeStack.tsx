import * as React from 'react';
import { useState } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import KeychainScreen from '../screens/KeychainScreen';
import AddKeychainScreen from '../screens/AddKeychainScreen';
import UpdateKeychainScreen from '../screens/UpdateKeychainScreen';
// Firebase
import auth from '@react-native-firebase/auth';

export type HomeStackScreenParamList = {
    // Groupe de connection
    Identification: { parentCallback: (childData: boolean) => void };
    Inscription: { parentCallback: (childData: boolean) => void };
    // Groupe après connection
    Keychain: undefined;
    AddKeychain: undefined;
    UpdateKeychain: undefined;
};

const Stack = createNativeStackNavigator<HomeStackScreenParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

const HomeStack = () => {

    const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(false);
    React.useEffect(()=>{
        let userAuth = auth().currentUser;
        console.log(userAuth?.uid);
        userAuth && setUserLoggedIn(false);
    },[])


    const handleCallback = (childData) => {
        setUserLoggedIn(childData);
    }

    // <Stack.Navigator initialRouteName="Identification">
    return (
        <Stack.Navigator>
            {userLoggedIn ? (
                <Stack.Group>
                    <Stack.Screen name="Keychain" component={KeychainScreen} />
                    <Stack.Screen name="AddKeychain" component={AddKeychainScreen} />
                    <Stack.Screen name="UpdateKeychain" component={UpdateKeychainScreen} />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Identification" component={SignInScreen} initialParams={{parentCallback: handleCallback}} />
                    <Stack.Screen name="Inscription" component={SignUpScreen} initialParams={{parentCallback: handleCallback}} />
                </Stack.Group>
            )}
            {/* écran communs ici */}
            {/*             
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Help" component={Help} />
            </Stack.Group> */}
        </Stack.Navigator>
    )
}

export default HomeStack;
