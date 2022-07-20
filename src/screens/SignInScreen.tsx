import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Forms
import { SignForm } from '../components/SignForm';
// Firebase
import auth from '@react-native-firebase/auth';
// autologin
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
// Biometry
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

type HomeScreenNavigationProp = NativeStackScreenProps<HomeStackScreenParamList, 'Identification'>

const rnBiometrics = new ReactNativeBiometrics();
const MMKVwithEncryption = new MMKVLoader().withEncryption().initialize(); // LocalStorage


// -------- IDENTIFICATION -------------
// Appelle un formulaire générique pour l'identification et l'inscription
const SignInScreen = ({ route, navigation }: HomeScreenNavigationProp) => {

    const [isBiometry, setIsBiometry] = useState<boolean>(false);

    // Identifiants stockés dans le localStorage
    const [userMustLogIn, setUserMustLogIn] = useMMKVStorage<boolean | undefined>("userMustLogIn", MMKVwithEncryption);
    const [userEmail, setUserEmail] = useMMKVStorage<string | undefined>("userEmail", MMKVwithEncryption);
    const [userPassword, setUserPassword] = useMMKVStorage<string | undefined>("userPassword", MMKVwithEncryption);

    const [data, setData] = useState(); // données saisie dans le formulaire
    const [error, setError] = useState<string>('');

    const callbackData = (childData: any) => {
        setData(childData);

        if (childData.biometrics && userEmail !== undefined && userPassword !== undefined) {
            // Login BIOMETRIQUE (fingerprint)
            rnBiometrics
                .biometricKeysExist()
                .then(resultObject => {
                    const { keysExist } = resultObject;

                    if (keysExist) {
                        rnBiometrics
                            .createSignature({
                                promptMessage: 'Sign in',
                                payload: "payload",
                            })
                            .then(resultObject => {
                                const { success, signature } = resultObject;

                                if (success) {
                                    console.log(signature);
                                    // verifySignatureWithServer(signature, payload);
                                    auth()
                                        .signInWithEmailAndPassword(userEmail, userPassword)
                                        .then(() => {
                                            // user logué, en page d'accueil, n'apparaîtra plus la page de login
                                            setUserMustLogIn(false);

                                            route.params.parentCallback(true);
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }
                            })
                            .catch(err => console.log(err));
                    } else {
                        rnBiometrics
                            .createKeys()
                            .then(resultObject => {
                                const { publicKey } = resultObject;
                                console.log(publicKey);
                                // sendPublicKeyToServer(publicKey);
                            })
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));

        } else {
            // Login SANS la BIOMETRIQUE (fingerprint)
            auth()
                .signInWithEmailAndPassword(childData.email, childData.password)
                .then(() => {
                    // Stockage des identifiants dans le localStorage
                    setUserEmail(childData.email);
                    setUserPassword(childData.password);
                    setUserMustLogIn(false);

                    // On renseigne la page parente que le user est connecté => TRUE
                    route.params.parentCallback(true);
                })
                .catch(error => {
                    switch (error.code) {
                        case 'auth/user-not-found':
                            setError("Il n'y a pas d'utilisateur correspondant à cet identifiant.");
                            break;
                        case 'auth/wrong-password':
                            setError("Le mot de passe n'est pas valide ou l'utilisateur ne possède pas de mot de passe.");
                            break;
                        case 'auth/too-many-requests':
                            setError("Nous avons bloqué toutes les demandes provenant de cet appareil en raison d'une activité inhabituelle. Essayez à nouveau plus tard. [L'accès à ce compte a été temporairement désactivé en raison de nombreuses tentatives de connexion infructueuses. Vous pouvez le rétablir immédiatement en réinitialisant votre mot de passe ou vous pouvez réessayer plus tard. ]]");
                            break;
                        default:
                            setError(error.message);
                    }
                    console.log(error);
                });
        }
    }

    return (
        <View style={styles.container}>

            <SignForm formType='sign-in' callBackTheData={callbackData} error={error} />

            <View style={styles.containerFooterText}>
                <Text style={styles.text}>Pas encore inscrit ?</Text>
                <Pressable onPress={() => navigation.navigate('Inscription')}>
                    <Text style={styles.textLink}>Créer un compte</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
        justifyContent: 'space-around',
    },
    containerFooterText: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textLink: {
        marginLeft: 10,
        color: 'blue',
    },
});