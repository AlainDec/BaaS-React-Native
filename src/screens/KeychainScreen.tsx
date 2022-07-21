import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Interfaces
import { IData } from '../Interfaces';
// Components
import DataList from '../components/DataList';
// autologin
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

type HomeScreenNavigationProp = NativeStackScreenProps<HomeStackScreenParamList, 'Identification'>

const MMKVwithEncryption = new MMKVLoader().withEncryption().initialize(); // LocalStorage

const KeychainScreen = ({ route, navigation }: HomeScreenNavigationProp) => {

    const [data, setData] = useState<IData[]>([]);
    const [countData, setCountData] = useState<number>(0);
    let userAuth = auth().currentUser;

    // Identifiants stockés dans le localStorage
    const [userMustLogIn, setUserMustLogIn] = useMMKVStorage<boolean | undefined>("userMustLogIn", MMKVwithEncryption);
    const [userEmail, setUserEmail] = useMMKVStorage<string | undefined>("userEmail", MMKVwithEncryption);
    const [userPassword, setUserPassword] = useMMKVStorage<string | undefined>("userPassword", MMKVwithEncryption);

    const onResult = (querySnapshot: any) => {
        // Récupération des datas en DB
        let items: IData[] = [];
        querySnapshot.forEach((snapshot: any) => {
            let id = { 'id:': snapshot.id }
            let item = snapshot.data();
            item.id = snapshot.id;
            items.push(item as IData);
        });

        setCountData(items.length);
        setData(items);
    }

    const onError = (error: any) => {
        console.error(error);
    }

    useEffect(() => {
        // Listener sur les modifications de la requête. Il surveille la collection "Trousseau"
        // lorsque les documents sont modifiés (suppression, ajout, modification)
        // Donc si j'ajoute un champ dans Firebase, en web, l'app mobile affichera en temps réel
        // la nouvelle ligne, sans refresh manuel !
        if (userAuth) {
            // Le RETURN permet d'arrêter le listener onSnapShot de Firestore.
            // Si on ne fait pas de return, il continuera à écouter, même si l'utilisateur n'est plus loggué, et donc : erreurs !
            return firestore()
                .collection('Users')
                .doc(userAuth.uid)
                .collection('Trousseau')
                .onSnapshot(onResult, onError);
        }

    }, [])

    const logout = () => {
        auth()
            .signOut()
            .then(() => {
                // Suppression des identifiants dans le localStorage
                // Ne sont plus supprimés car ajout du fingerprint qui en a besoin :)
                //setUserEmail('');
                //setUserPassword('');
                setUserMustLogIn(true);

                // On renseigne la page parente que le user est déconnecté => FALSE
                route.params.parentCallback(false);
            })
            .finally(() => {
                console.log("userEmail (après delogue) = " + userEmail);
            });
    }

    const galery = () => {
        navigation.navigate('Galery');
    }

    const addItem = (): void => {
        navigation.navigate("AddKeychain");
    }

    const updateItem = (itemId: string): void => {
        navigation.navigate("UpdateKeychain", {
            itemId: itemId
        });
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.count}>{countData} compte{countData > 1 && 's'}</Text>
            </View>

            {
                // data.map( (item: IData) => <DataList {...item} /> )
                data.map((item: IData) => <DataList data={item} upload={(titi: string) => updateItem(titi)} key={item.id} />)
            }

            <View style={styles.containerButtons}>
                <Pressable onPress={logout}>
                    <View style={styles.button}>
                        <Icon name="power-standby" size={28} color="white" />
                    </View>
                </Pressable>
                <Pressable onPress={galery}>
                    <View style={styles.button}>
                        <Icon name="image-multiple" size={28} color="white" />
                    </View>
                </Pressable>
                <Pressable onPress={addItem}>
                    <View style={styles.button}>
                        <Icon name="plus" size={28} color="white" />
                        <Text style={styles.textButton}>Ajouter</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default KeychainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
    },
    containerButtons: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginTop: 20,
        flexDirection: 'row'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: 'tomato',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
        flexDirection: 'row'
    },
    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    count: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 22,
    },
});