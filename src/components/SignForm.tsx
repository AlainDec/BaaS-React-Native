import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import * as React from 'react';
import { useState } from 'react';
import { InputCustom } from './InputCustom';
// Formulaire
import { useForm, Controller } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// autologin
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
// Biometry
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

// ------- Formulaire
type FormValues = {
    email: string;
    password: string;
    operation: 'sign-in' | 'sign-up';
    biometrics: boolean;
}
interface IForm {
    formType: 'sign-in' | 'sign-up';
    callBackTheData: (data: FormValues) => void;
    error?: string;
}

const MMKVwithEncryption = new MMKVLoader().withEncryption().initialize(); // LocalStorage
const rnBiometrics = new ReactNativeBiometrics();

export const SignForm = (props: IForm) => {

    const { formType, callBackTheData, error } = props;
    const [isBiometry, setIsBiometry] = useState<boolean>(false);
    // Identifiants stockés dans le localStorage
    const [userEmail, setUserEmail] = useMMKVStorage<string | undefined>("userEmail", MMKVwithEncryption);
    const [userPassword, setUserPassword] = useMMKVStorage<string | undefined>("userPassword", MMKVwithEncryption);

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackScreenParamList>>();

    // DETECTION BIOMETRIQUE ----------------------------------------------------
    rnBiometrics.isSensorAvailable()
        .then((resultObject) => {
            const { available, biometryType } = resultObject

            if (available && biometryType === BiometryTypes.TouchID) {
                console.log('TouchID is supported (iOS)')
            }
            if (available && biometryType === BiometryTypes.FaceID) {
                console.log('FaceID is supported (iOS)')
            }
            if (available && biometryType === BiometryTypes.Biometrics) {
                console.log('Biometrics is supported')
                setIsBiometry(true);
            } else {
                console.log('Biometrics not supported')
            }
        })

    // REACT HOOK FORM ----------------------------------------------------
    const validationSchema = Yup.object({
        email: Yup.string().email('Format d\'email invalide').required('Veuillez saisir votre email'),
        password: Yup.string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        ).required('Veuillez saisir votre mot de passe'),
    });
    // useForm prends en paramètre un résolver (nécessite librairie)
    // - control : permet de wraper les champs avec React Tool Form
    // - handleSubmit : pour submit le form
    // - formState : pour savoir où en est le state et récupérer les erreurs
    // formValue : pour que le useForm reconnaisse les types des champs
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        shouldUnregister: false,
        defaultValues: {
            operation: formType,
            biometrics: false,
        } // simule un champ hidden dans lequel je passe des données
    })

    const onSubmit: any = (data: FormValues) => {
        // Envoi des données en page parente qui gère les formulaires
        callBackTheData(data);
    }

    const onSubmitBiometrics = () => {
        // Envoi des données en page parente qui gère les formulaires
        // Reconstruction des données
        callBackTheData({"email": "", "operation": "sign-in", "password": "", "biometrics" : true} as FormValues);
    }

    return (
        <ScrollView style={styles.container}>
            {/* un Controller de React Hook Form est utilisé pour chaque champ */}
            {/* !!error : les deux !!, explications : error est de type FieldError, mais on veut qu'il devienne un booléen
                          alors pour cela on met 2 exclamations :
                          - la première pour checker si ce n'est pas défini
                          - la deuxième pour le remettre dans l'état normal pour l'autotyper en booléen
           */}
            <Controller
                control={control}
                rules={{ required: true, maxLength: 50, }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <InputCustom
                        value={value}
                        placeholder="Email"
                        error={!!error}
                        errorDetails={error?.message}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboard="email-address"
                    />
                )}
                name="email"
            />

            <Controller
                control={control}
                rules={{ required: true, }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <InputCustom
                        value={value}
                        placeholder="Mot de passe"
                        error={!!error}
                        errorDetails={error?.message}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        password={true}
                    />
                )}
                name="password"
            />

            {error !== '' && <Text style={styles.textError}>{error}</Text>}

            <View style={styles.containerButtons}>
                {/* Submit du formulaire */}
                <Pressable onPress={handleSubmit(onSubmit)}>
                    <View style={styles.button}>
                        <Text style={styles.text}>{formType === 'sign-in' ? 'Connection' : 'Créer mon compte'}</Text>
                    </View>
                </Pressable>
                {/* Bypass le formulaire.  On affiche le bouton de biometrie s'il est activé sur le mobile et s'il
                    y a déjà eu une première connexion avec les identifiants stockés dans le localstorage */}
                {
                    isBiometry && userEmail && userPassword && formType === 'sign-in' && 
                        <Pressable onPress={onSubmitBiometrics}>
                            <View style={styles.icon}>
                                <Icon name="fingerprint" size={44} color="white" />
                            </View>
                        </Pressable>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    containerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        marginVertical: 10,
        paddingHorizontal: 25,
        padding: 15,
        backgroundColor: 'tomato',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
    },
    icon: {
        marginVertical: 10,
        paddingHorizontal: 15,
        padding: 6,
        backgroundColor: 'tomato',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
    },
    text: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        fontWeight: 'bold',
    },
    textError: {
        color: 'red',
    }
})
