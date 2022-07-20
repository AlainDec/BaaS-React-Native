import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Forms
import { SignForm } from '../components/SignForm';
// Firebase
import auth from '@react-native-firebase/auth';

type HomeScreenNavigationProp = NativeStackScreenProps<HomeStackScreenParamList, 'Inscription'>


// -------- INSCRIPTION -------------
// Appelle un formulaire générique pour l'identification et l'inscription
const SignUpScreen = ({ route, navigation }: HomeScreenNavigationProp) => {

    const [data, setData] = useState(); // données saisie dans le formulaire
    const [error, setError] = useState<string>('');

    const callbackData = (childData: any) => {
        setData(childData);

        auth()
            .createUserWithEmailAndPassword(childData.email, childData.password)
            .then(() => {
                // On renseigne la page parente que le user est loggué => TRUE
                route.params.parentCallback(true);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setError("Cette adresse e-mail est déjà utilisée !");
                } else if (error.code === 'auth/invalid-email') {
                    setError("Cette adresse e-mail n'est pas valide !");
                }
                console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <SignForm formType='sign-up' callBackTheData={callbackData} />
        </View>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
        justifyContent: 'space-around',
    },
});