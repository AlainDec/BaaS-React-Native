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
// autologin
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import Loading from '../components/Loading';


// Ignorer les warning de la navigation pour les données non sérialisables
// Pour éviter cette méthode, il est préférable d'utiliser React Context
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export type HomeStackScreenParamList = {
    // Groupe de connection
    Identification: { parentCallback: (childData: boolean) => void };
    Inscription: { parentCallback: (childData: boolean) => void };
    // Groupe après connection
    Keychain: { parentCallback: (childData: boolean) => void };
    AddKeychain: undefined;
    UpdateKeychain: { itemId: string };
    // loading
    Loading: undefined;
};

const Stack = createNativeStackNavigator<HomeStackScreenParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

interface Props {
    auth: boolean;
}

const MMKV = new MMKVLoader().initialize();

//const HomeStack = ({auth}: Props): JSX.Element => {
const HomeStack = (): JSX.Element => {

    // const MMKVwithEncryption = new MMKVLoader()
    //     .withEncryption()
    //     .initialize();

    //console.log("AUTH = " + auth);

    // flag de connexion ou non
    const [userLoggedIn, setUserLoggedIn] = useState<number>(0);

    // Identifiants stockés dans le localStorage
    const [userEmail, setUserEmail] = useMMKVStorage<string | undefined>("userEmail", MMKV);
    const [userPassword, setUserPassword] = useMMKVStorage<string | undefined>("userPassword", MMKV);

    console.log("** userEmail = " + userEmail + ", userPassword = " + userPassword);

    useEffect(() => {

        let userAuth = auth().currentUser;
        console.log("HomeStack: userAuth?.uid = " + userAuth?.uid);

        // Récupération des identifiants dans le localStorage s'ils existent, 
        // et alors connection en bdd pour renseigner auth.
        if (userEmail && userPassword) {
            auth()
                .signInWithEmailAndPassword(userEmail, userPassword)
                .then(() => {
                    console.log('HomeStack: Utilisateur autologué !');
                    setUserLoggedIn(2);
                })
                .catch(error => {
                    switch (error.code) {
                        case 'auth/user-not-found':
                            console.log("Il n'y a pas d'utilisateur correspondant à cet identifiant.");
                            break;
                        case 'auth/wrong-password':
                            console.log("Le mot de passe n'est pas valide ou l'utilisateur ne possède pas de mot de passe.");
                            break;
                        case 'auth/too-many-requests':
                            console.log("Nous avons bloqué toutes les demandes provenant de cet appareil en raison d'une activité inhabituelle. Essayez à nouveau plus tard. [L'accès à ce compte a été temporairement désactivé en raison de nombreuses tentatives de connexion infructueuses. Vous pouvez le rétablir immédiatement en réinitialisant votre mot de passe ou vous pouvez réessayer plus tard. ]]");
                            break;
                        default:

                    }
                    console.log(error);

                    setUserLoggedIn(1);
                    setUserEmail('');
                    setUserPassword('');
                });
        } else {
            setUserLoggedIn(1);
        }
    }, [])


    const handleCallback = (childData = false) => {
        console.log("childData = " + childData);

        setUserLoggedIn(childData ? 2 : 1);
    }

    console.log("HomeStack: userLoggedIn = " + userLoggedIn);

    return (
        <Stack.Navigator>
            {userLoggedIn == 2 ? (
                <Stack.Group>
                    <Stack.Screen name="Keychain" component={KeychainScreen} initialParams={{ parentCallback: handleCallback }} />
                    <Stack.Screen name="AddKeychain" component={AddKeychainScreen} />
                    <Stack.Screen name="UpdateKeychain" component={UpdateKeychainScreen} />
                </Stack.Group>
            ) : userLoggedIn == 1 ? (
                <Stack.Group>
                    <Stack.Screen name="Identification" component={SignInScreen} initialParams={{ parentCallback: handleCallback }} />
                    <Stack.Screen name="Inscription" component={SignUpScreen} initialParams={{ parentCallback: handleCallback }} />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Loading" component={Loading} />
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
