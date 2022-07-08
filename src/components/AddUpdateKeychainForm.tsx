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
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

    console.log("------------------------------------------------------------------------------- AddUpdateKeychainForm");

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackScreenParamList>>();

    const { errorOutOfForm, setErrorOutOfForm } = useState<string>('');
    const { formType, itemId } = props;
    console.log("OPERATION: " + formType + " - ITEMID (ligne concernée): " + itemId);

    let userAuth = auth().currentUser;

    // Va stocker les données lues en DB dans le cas d'un update avec passage de l'ID de ligne en paramètre
    const [defaultValuesDb, setDefaultValuesDb] = useState({
        email: '',
        password: '',
        name: '',
        type: ''
    });

    // REACT HOOK FORM ----------------------------------------------------
    const validationSchema = Yup.object({
        email: Yup.string().email("Format d'email invalide").required("Veuillez saisir votre email"),
        password: Yup.string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        ).required("Veuillez saisir votre mot de passe"),
        name: Yup.string().required("Veuillez saisir un nom"),
        type: Yup.string().required("Veuillez choisir un type de support"),
    });

    // React Hook Form
    // useForm prends en paramètre un résolver (nécessite librairie)
    // - control permet de wraper les champs avec React Tool Form
    // - handleSubmit pour submit le form
    // - formState pour savoir où en est le state et récupérer les erreurs
    // - reset, permet de remplacer les champs par un nouveau contenu, voir les defaultValues
    // formValues pour que le useForm connaisse bien les types des champs
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValuesDb, // Si update : pré-rempli les champs avec les données de la DB
    })

    // Dans le cas de l'update, va lire les données en DB pour remplir les champs en defaultValues
    useEffect(() => {

        if (formType === 'update' &&
            userAuth &&
            (itemId !== '' || itemId !== undefined)) {

            console.log("AddUpdateKeychainForm: utilisateur = " + userAuth?.uid);

            // Listener sur les modifications de la requête. Il surveille la collection "Trousseau"
            // lorsque les documents sont modifiés (suppression, ajout, modification)
            // Donc si j'ajoute un champ dans Firebase, en web, l'app mobile affichera en temps réel
            // la nouvelle ligne, sans refresh manuel !
            // récupération des données
            async function getItemDB() {

                let docRef = firestore()
                    .collection('Users')
                    .doc(userAuth?.uid)
                    .collection('Trousseau')
                    .doc(itemId);

                try {
                    var doc = await docRef.get()
                    if (doc.exists) {
                        console.log('Data récupérées: ');
                        console.log(doc.data());
                        // Il faut ajouter un 'as FormValues' afin que les données lues en DB soient au même format que mes données.
                        // Sinon, l'erreur suivante sera retournée :
                        //   L'argument de type 'DocumentData' n'est pas attribuable au paramètre de type 'SetStateAction<FormValues>'.
                        //   Le type 'DocumentData' n'a pas les propriétés suivantes du type 'FormValues': email, password, name, type - ts(2345)
                        let dataDb = doc.data() as FormValues;
                        if (dataDb !== undefined) {

                            // Ca fonctionne ci-dessous en com, mais c'est encore mieux avec un 'as'
                            // setUserUpdateData({email :toto.email, name :toto.name, password : toto.password, type :toto.type});
                            setDefaultValuesDb(dataDb);
                            // On reset les champs pour les préremplir avec la DB.
                            reset(dataDb)
                        }
                        return doc.data();
                    } else {
                        setErrorOutOfForm("--------- PAS DE DOC");
                        console.log("--------- PAS DE DOC");
                    }
                } catch (error) {
                    console.log("---------- Erreur GET:", error);
                };
            }
            getItemDB();
        }
    }, [reset]);

    const deleteItem = (): void => {
        console.log("KeychainScreen: delete " + itemId);

        firestore()
            .collection('Users')
            .doc(userAuth?.uid)
            .collection('Trousseau')
            .doc(itemId)
            .delete()
            .then(() => {
                console.log("line " + itemId + " deleted");
            });
        
        navigation.goBack();
    }

    const onSubmit: any = (data: FormValues) => {

        if (userAuth && data !== undefined) {
            console.log('---data enfant----');
            console.log(data);

            // Ajout/update des data en DB
            switch (formType) {
                case 'add':
                    firestore()
                        .collection('Users')
                        .doc(userAuth.uid)
                        .collection('Trousseau')
                        .add({
                            email: data.email,
                            name: data.name,
                            password: data.password,
                            type: data.type
                        })
                        .then(() => {
                            console.log('APP / SITE AJOUTE !');
                        });
                    break;
                case 'update':
                    firestore()
                        .collection('Users')
                        .doc(userAuth.uid)
                        .collection('Trousseau')
                        .doc(itemId)
                        .update({
                            email: data.email,
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
                render={({ field: { value, onChange } }) => (
                    <RadioButton.Group
                        onValueChange={onChange}
                        value={value}>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value={"a"}
                                    status={'unchecked'}
                                />
                                <Text>Site internet</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                <RadioButton
                                    value={"b"}
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

            <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                {
                    formType === 'update' && 
                        <Pressable onPress={deleteItem}>
                            <View style={[styles.buttonSmall, styles.alert]}>
                                <Icon name="close-thick" size={28} color="white" />
                            </View>
                        </Pressable>

                }
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
    buttonSmall: {
        marginVertical: 2,
        paddingVertical: 6,
        paddingHorizontal: 6,
        backgroundColor: 'tomato',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
    },
    alert: {
        backgroundColor: 'red',
    },
    text: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        fontWeight: 'bold',
    },
    textSmall: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 14,
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
