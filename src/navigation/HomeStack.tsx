import * as React from 'react';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import KeychainScreen from '../screens/KeychainScreen';
import AddKeychainScreen from '../screens/AddKeychainScreen';
import UpdateKeychainScreen from '../screens/UpdateKeychainScreen';
// Firebase
import auth from '@react-native-firebase/auth';
// Ignorer les warning de la navigation pour les données non sérialisables
import { LogBox } from 'react-native';

// Ignorer les warning de la navigation pour les données non sérialisables
// Pour éviter cette méthode, il est préférable d'utiliser React Context
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export type HomeStackScreenParamList = {
    // Groupe de connection
    Identification: { parentCallback: (childData: boolean) => void };
    //Identification: { itemId: string };
    Inscription: { parentCallback: (childData: boolean) => void };
    // Groupe après connection
    Keychain: { parentCallback: (childData: boolean) => void };
    AddKeychain: undefined;
    UpdateKeychain: undefined;
};

const Stack = createNativeStackNavigator<HomeStackScreenParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

interface Props {
    auth: boolean;
}

//const HomeStack = ({auth}: Props): JSX.Element => {
const HomeStack = (): JSX.Element => {

    //console.log("AUTH = " + auth);

    const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(false);
    useEffect(() => {
        let userAuth = auth().currentUser;
        console.log("HomeStack: userAuth?.uid = " + userAuth?.uid);
        userAuth && setUserLoggedIn(false);
    }, [])


    const handleCallback = (childData = false) => {
        console.log("childData = " + childData);

        setUserLoggedIn(childData);
    }

    console.log("HomeStack: userLoggedIn = " + userLoggedIn);

    // <Stack.Navigator initialRouteName="Identification">
    return (
        <Stack.Navigator>
            {userLoggedIn ? (
                <Stack.Group>
                    <Stack.Screen name="Keychain" component={KeychainScreen} initialParams={{ parentCallback: handleCallback }} />
                    <Stack.Screen name="AddKeychain" component={AddKeychainScreen} />
                    <Stack.Screen name="UpdateKeychain" component={UpdateKeychainScreen} />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Identification" component={SignInScreen} initialParams={{ parentCallback: handleCallback }} />
                    <Stack.Screen name="Inscription" component={SignUpScreen} initialParams={{ parentCallback: handleCallback }} />
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
