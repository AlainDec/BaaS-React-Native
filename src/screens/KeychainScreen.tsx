import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity, FlatList } from 'react-native';
//import { Button } from 'react-native-paper';
// Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

interface TData {
    id: string;
    email: string;
    password: string;
    name: string;
    type: string;
}

const KeychainScreen = ({ route, navigation }: NativeStackNavigationProp<HomeStackScreenParamList, 'Identification'>) => {

    //const navigation = useNavigation<HomeScreenNavigationProp>();
    const [data, setData] = useState<any>();
    const [countData, setCountData] = useState<number>(0);
    let userAuth = auth().currentUser;

    function onResult(querySnapshot: any) {
        console.log('KeychainScreen: Récupération de la collection des users');

        // Récupération des datas en DB
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
        console.log("KeychainScreen: utilisateur = " + userAuth?.uid);
        // Listener sur les modifications de la requête. Il surveille la collection "Trousseau"
        // lorsque les documents sont modifiés (suppression, ajout, modification)
        // Donc si j'ajoute un champ dans Firebase, en web, l'app mobile affichera en temps réel
        // la nouvelle ligne, sans refresh manuel !
        console.log("KeychainScreen: useEffect()");
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
                console.log('KeychainScreen: Utilisateur délogué !');

                // On renseigne la page parente que le user est déconnecté => FALSE
                route.params.parentCallback(false);
            });
    }

    const addItem = (): void => {
        console.log("add ");

        navigation.navigate("AddKeychain");
    }

    const updateItem = (itemId: string): void => {
        console.log("KeychainScreen: update " + itemId);

        navigation.navigate("UpdateKeychain", {
            itemId: itemId
        });
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
    }

    const ItemSeparator = () => <View style={{
        height: 1,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.1)",
    }} />

    const [selectedId, setSelectedId] = useState(null);
    const [eyeToggle, setEyeToggle] = useState<{id:string; value:boolean}[]>([]);
    const renderItem = ({ item, index }: any) => {
        const backgroundColor = (item.id === selectedId) ? "yellow" : "orange";
        /*
        setEyeToggle(prevState => {
            const { favorites } = prevState;
            const isFavorite = favorites.includes(item.id);
            return {
                favorites: isFavorite
                    ? favorites.filter(title => title !== item)
                    : [item, ...favorites],
            };
        })
        */
       /*
        setEyeToggle(prevEye => [
            ...prevEye,
            {id: item.id, value: false}
        ]);
*/
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => updateItem(item.id)} style={[styles.row, { flex: 12, }]}>
                    <Text style={[styles.textItem, styles.textLine1]}>{item.name}</Text>
                    <Text style={[styles.textItem, styles.textLine2]}>{item.email}</Text>
                    <Text style={[styles.textItem, styles.textLine3]}>{eyeToggle ? item.password : '**'}</Text>
                    {/* <Text style={[styles.textItem, { width: '20%' }]}>{item.type === 'a' ? 'Web' : 'Mobile'}</Text> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEyeToggle(!eyeToggle)} style={[styles.row, { flex: 1, justifyContent: 'flex-end', paddingTop: 7 }]}>
                    <Icon name="eye-outline" size={27} color="tomato" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.count}>{countData} compte{countData > 1 && 's'}</Text>
                {/* <Button icon="trash-can-outline" color="black" onPress={addItem} /> */}
                <Pressable onPress={addItem} style={[{ alignSelf: 'flex-end' }]}>
                    <View style={styles.buttonSmall}>
                        <Icon name="plus" size={28} color="white" />
                    </View>
                </Pressable>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
                ItemSeparatorComponent={ItemSeparator}
            />

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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
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
    textItem: {
        color: 'black',
        fontSize: 14,
        paddingRight: 0,
        paddingVertical: 8,
    },
    textLine1: {
        flex: 1,
        backgroundColor: '#eaeaea',
    },
    textLine2: {
        flex: 1.5,
        backgroundColor: '#f5f5f5',
    },
    textLine3: {
        flex: 1.5,
        backgroundColor: '#fffcfc',
    },
    count: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 22,
    },
    row: {
        flexDirection: 'row',
    }
});