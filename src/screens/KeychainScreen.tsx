import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, FlatList } from 'react-native';
// Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Firebase
//import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// Icônes
import Icon from 'react-native-vector-icons/FontAwesome';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

interface TData {
    id: string;
    login: string;
    password: string;
    name: string;
    type: string;
    //userId: string;
}

const KeychainScreen = ({route, navigation}:NativeStackNavigationProp<HomeStackScreenParamList, 'Identification'>) => {

    //const navigation = useNavigation<HomeScreenNavigationProp>();
    const [data, setData] = useState<any>();
    const [countData, setCountData] = useState<number>(0);
    let userAuth = auth().currentUser;

    function onResult(querySnapshot: any) {
        console.log('KeychainScreen: Récupération de la collection des users');

        let items: TData[] = [];
        querySnapshot.forEach((snapshot: any) => {
            console.log("KeychainScreen: ID=" + snapshot.id);
            let id = { 'id:': snapshot.id }
            let item = snapshot.data();
            item.id = snapshot.id;
            items.push(item);
        });

        console.log("KeychainScreen: onResult()");
        console.log(items);
        setCountData(items.length);
        setData(items);
    }

    function onError(error: any) {
        console.error(error);
    }

    useEffect(() => {
        //const user = auth().currentUser;
        console.log("KeychainScreen: utilisateur = " + userAuth?.uid);
        // Listener sur les modifications de la requête. Il surveille la collection "Trousseau"
        // lorsque les documents sont modifiés (suppression, ajout, modification)
        // Donc si j'ajoute un champ dans Firebase, en web, l'app mobile affichera en temps réel
        // la nouvelle ligne, sans refresh manuel !
        console.log("KeychainScreen: useEffect()");
        if (userAuth) {
            firestore()
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
                console.log('KeychainScreen: Utilisateur délogué !');

                // On renseigne la page parente que le user est loggué => TRUE
                route.params.parentCallback(false);
                /*
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Identification' }]
                })
                */
            });
    }
    /*
        firestore().collection('Trousseau').add({
            login: 'dddxxx@yyy.zz',
            name: "truc",
            password: "xxxxxxxx",
            type: "web"
        })
    */

    const addItem = (): void => {
        console.log("add ");

        navigation.navigate("AddKeychain");
        /*
        if (userAuth) {
            firestore()
                .collection('Users')
                .doc(userAuth.uid)
                .collection('Trousseau')
                .add({
                    login: 'dddxxx@yyy.zz',
                    name: "truc",
                    password: "xxxxxxxx",
                    type: "web"
                });
            //setSelectedId(item.id)
        }
        */
    }

    const updateItem = (itemId: string): void => {
        console.log("KeychainScreen: update " + itemId);

        navigation.navigate("AddKeychain", {
            itemId: itemId
        });
        //setSelectedId(item.id)
    }

    const deleteItem = (id: string): void => {
        console.log("KeychainScreen: delete " + id);

        firestore()
            .collection('Users')
            .doc(userAuth?.uid)
            .collection('Trousseau')
            .doc(id)
            .delete()
            .then(() => {
                console.log("user " + id + " deleted");
            });
        //setSelectedId(item.id)
    }

    const ItemSeparator = () => <View style={{
        height: 1,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.1)",
      }} />

    const [selectedId, setSelectedId] = useState(null);
    const renderItem = ({ item }: any) => {
        const backgroundColor = (item.id === selectedId) ? "yellow" : "orange";

        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.textItem, { width: '40%' }]}>{item.login}</Text>
                <Text style={[styles.textItem, { width: '25%' }]}>{item.name}</Text>
                <Text style={[styles.textItem, { width: '20%' }]}>{item.type === 'a' ? 'Web' : 'Mobile'}</Text>
                <TouchableOpacity onPress={() => updateItem(item.id)}>
                    <Text style={[styles.textItem, { backgroundColor, width: '7%', minWidth: 25 }]}> U</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Text style={[styles.textItem, { backgroundColor, width: '7%', minWidth: 25 }]}> D</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.count}>{countData} compte{countData > 1 && 's'}</Text>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
                ItemSeparatorComponent={ItemSeparator}
            />
            <Pressable onPress={addItem} style={[styles.pressable, { alignSelf: 'flex-end' }]}>
                <View style={styles.button}>
                    <Text style={styles.text}>Ajouter</Text>
                </View>
            </Pressable>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Pressable onPress={logout} style={styles.pressable}>
                    <View style={styles.button}>
                        <Text style={styles.text}>Se déconnecter</Text>
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
        justifyContent: 'space-around',
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
    title: {
        fontSize: 14,
    },
    textItem: {
        color: 'black',
        fontSize: 14,
    },
    count: {
        marginBottom: 30,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    }
});