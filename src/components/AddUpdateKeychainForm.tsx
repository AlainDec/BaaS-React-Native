import { Text, View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { InputCustom } from './InputCustom';
// Formulaire
import { useForm, Controller } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RadioButton } from 'react-native-paper';
// Navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


// ------- Formulaire
type FormValues = {
    email: string;
    password: string;
    name: string;
    type: string;
}
interface IForm {
    formType: 'add' | 'update';
    itemId?: string;
}


export const AddUpdateKeychainForm = (props: IForm) => {

    const { formType, itemId } = props;

    console.log("OPERATION : " + formType);

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackScreenParamList>>();

    // REACT HOOK FORM ----------------------------------------------------
    const validationSchema = Yup.object({
        email: Yup.string().email('Format d\'email invalide').required('Veuillez saisir votre email'),
        password: Yup.string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        ).required('Veuillez saisir votre mot de passe'),
        name: Yup.string().required('Veuillez saisir un nom'),
        type: Yup.string().required('Veuillez choisir un type de support'),
    });

    // React Hook Form
    // useForm prends en paramètre un résolver (nécessite librairie)
    // - control permet de wraper les champs avec React Tool Form
    // - handleSubmit pour submit le form
    // - formState pour savoir où en est le state et récupérer les erreurs
    // formValue pour que le useForm connaisse bien les types des champs
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    })

    const onSubmit: any = (data: FormValues) => {
        console.log('---data enfant----');
        //console.log(data);
        //callBackTheData(data);

        let userAuth = auth().currentUser;

        if (userAuth && data !== undefined) {
            // Ajout des data en DB
            console.log(data);

            switch (formType) {
                case 'add' :
                    firestore()
                        .collection('Users')
                        .doc(userAuth.uid)
                        .collection('Trousseau')
                        .add({
                            login: data.email,
                            name: data.name,
                            password: data.password,
                            type: data.type
                        })
                        .then(() => {
                            console.log('APP / SITE AJOUTE !');
                        });
                    break;
                case 'update' :
                    firestore()
                        .collection('Users')
                        .doc(userAuth.uid)
                        .collection('Trousseau')
                        .doc(itemId)
                        .set({
                            login: data.email,
                            name: data.name,
                            password: data.password,
                            type: data.type
                        })
                        .then(() => {
                            console.log('APP / SITE MIS A JOUR !');
                        });
                    break;
                default: 
            }
            // TODO ajouter les .then et 3.error
        }

        // navigation.navigate('Identification');
        navigation.goBack();
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

            <Controller
                control={control}
                rules={{ required: true, maxLength: 50, }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <InputCustom
                        value={value}
                        placeholder="Nom du site ou de l'application"
                        error={!!error}
                        errorDetails={error?.message}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
                )}
                name="name"
            />

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <RadioButton.Group
                        onValueChange={onChange}
                        value={value}>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value={"a"}
                                    //status={checked === 'a' ? 'checked' : 'unchecked'}
                                    status={'unchecked'}
                                />
                                <Text>Site internet</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                <RadioButton
                                    value={"b"}
                                    //status={checked === 'b' ? 'checked' : 'unchecked'}
                                    status={'unchecked'}
                                />
                                <Text>Application mobile</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                )}
                name="type"
            />
            {/* gestion de l'erreur pour le radio button uniquement */}
            {errors.type && errors.type.type === "required" && <Text style={styles.txtError}>{errors.type.message}</Text>}

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Pressable onPress={handleSubmit(onSubmit)} style={styles.pressable}>
                    <View style={styles.button}>
                        <Text style={styles.text}>{formType === 'add' ? 'Ajouter' : 'Mettre à jour'}</Text>
                    </View>
                </Pressable>
            </View>

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    pressable: {
        width: '60%',
    },
    button: {
        marginVertical: 10,
        padding: 15,
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
    txtError: {
        color: '#ac0000',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
