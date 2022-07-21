import * as React from 'react';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import KeychainScreen from '../screens/KeychainScreen';
import AddKeychainScreen from '../screens/AddKeychainScreen';
import UpdateKeychainScreen from '../screens/UpdateKeychainScreen';
import GaleryScreen from '../screens/GaleryScreen';
// Firebase
import auth from '@react-native-firebase/auth';
// Ignorer les warning de la navigation pour les données non sérialisables
import { LogBox } from 'react-native';
// Autologin via localStorage
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
    Inscription: { parentCallback: (childData: boolean) => void } | undefined;
    // Groupe après connection
    Keychain: { parentCallback: (childData: boolean) => void };
    AddKeychain: undefined;
    UpdateKeychain: { itemId: string };
    Galery: undefined;
    // Loading
    Loading: undefined;
};

enum STACKCHOICE { 
    LOADING,
    SIGN,
    LOGGED
}

const Stack = createNativeStackNavigator<HomeStackScreenParamList>();
const MMKVwithEncryption = new MMKVLoader().withEncryption().initialize(); // LocalStorage

const HomeStack = (): JSX.Element => {

    // Flag de connexion ou non, par défaut sur l'icône animée de loading
    const [userLoggedIn, setUserLoggedIn] = useState<STACKCHOICE>(STACKCHOICE.LOADING);

    // Identifiants stockés dans le localStorage
    const [userMustLogIn, setUserMustLogIn] = useMMKVStorage<boolean | undefined>("userMustLogIn", MMKVwithEncryption);
    const [userEmail, setUserEmail] = useMMKVStorage<string | undefined>("userEmail", MMKVwithEncryption);
    const [userPassword, setUserPassword] = useMMKVStorage<string | undefined>("userPassword", MMKVwithEncryption);

    useEffect(() => {

        let userAuth = auth().currentUser;

        // Récupération des identifiants dans le localStorage s'ils existent, 
        // et alors connection en bdd pour renseigner auth.
        if (userEmail && userPassword && userMustLogIn === false) {
            auth()
                .signInWithEmailAndPassword(userEmail, userPassword)
                .then(() => {
                    setUserLoggedIn(STACKCHOICE.LOGGED);
                    setUserMustLogIn(false);
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

                    setUserLoggedIn(STACKCHOICE.SIGN);
                    setUserEmail('');
                    setUserPassword('');
                    setUserMustLogIn(true);
                });
        } else {
            setUserLoggedIn(STACKCHOICE.SIGN);
            setUserMustLogIn(true);
        }
    }, [])

    // Fonction passée en paramètres aux enfants afin de faire communiquer l'enfant au parent
    const handleCallback = (childData = false) => {
        setUserMustLogIn(!childData);
        setUserLoggedIn(childData ? STACKCHOICE.LOGGED : STACKCHOICE.SIGN);
    }

    return (
        <Stack.Navigator>
            {userLoggedIn === STACKCHOICE.LOGGED && userMustLogIn === false ? (
                <Stack.Group>
                    <Stack.Screen name="Keychain" component={KeychainScreen} initialParams={{ parentCallback: handleCallback }} />
                    <Stack.Screen name="AddKeychain" component={AddKeychainScreen} />
                    <Stack.Screen name="UpdateKeychain" component={UpdateKeychainScreen} />
                    <Stack.Screen name="Galery" component={GaleryScreen} />
                </Stack.Group>
            ) : userLoggedIn === STACKCHOICE.SIGN ? (
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
