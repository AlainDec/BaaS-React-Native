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


// ------- Formulaire
type FormValues = {
    email: string;
    password: string;
    name: string;
    type: string;
    operation: 'add' | 'update';
}
interface IForm {
    formType: 'add' | 'update';
    //callBackTheData: (data: FormValues) => void;
    error?: string;
}


export const AddUpdateKeychainForm = (props: IForm) => {

    const { formType/*, callBackTheData*/, error } = props;

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackScreenParamList>>();

    const [checked, setChecked] = useState<string>("a"); // initial choice : site

    // REACT HOOK FORM ----------------------------------------------------
    const validationSchema = Yup.object({
        email: Yup.string().email('Format d\'email invalide').required('Veuillez saisir votre email'),
        password: Yup.string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        ).required('Veuillez saisir votre mot de passe'),
        name: Yup.string().required('Veuillez saisir un nom'),
        type: Yup.string(),
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
        defaultValues: {
            operation: formType
        } // utile pour simuler un champ hidden qui précise si je fais un login ou création de login
    })

    const onSubmit: any = (data: FormValues) => {
        console.log('---data enfant----');
        console.log(data);
        //callBackTheData(data);

        // navigation.navigate('Identification');
        //navigation.navigate('Dashboard');
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
                render={({ field: { value }, fieldState: { error } }) => (
                    <RadioButton.Group onValueChange={newValue => setChecked(newValue)} value={value}>
                            <RadioButton
                                value={"a"}
                                status={checked === 'a' ? 'checked' : 'unchecked'}
                            />
                            <RadioButton
                                value={"b"}
                                status={checked === 'b' ? 'checked' : 'unchecked'}
                            />
                    </RadioButton.Group>
                    // <View style={{flexDirection: 'row', marginTop: 25}}>
                    //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    //         <RadioButton
                    //             value={value}
                    //             status={checked === 0 ? 'checked' : 'unchecked'}
                    //             onPress={() => setChecked(0)}
                    //         />
                    //         <Text>Site internet</Text>
                    //     </View>
                    //     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                    //         <RadioButton
                    //             value={value}
                    //             status={checked === 1 ? 'checked' : 'unchecked'}
                    //             onPress={() => setChecked(1)}
                    //         />
                    //         <Text>Application mobile</Text>
                    //     </View>
                    // </View>
                )}
                name="type"
            />

            {error !== '' && <Text style={styles.textError}>{error}</Text>}

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Pressable onPress={handleSubmit(onSubmit)} style={styles.pressable}>
                    <View style={styles.button}>
                        <Text style={styles.text}>{formType === 'add' ? 'Ajouter' : 'Mettre à jour'}</Text>
                    </View>
                </Pressable>
            </View>

        </ScrollView>
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
    textError: {
        color: 'red',
    }
})
