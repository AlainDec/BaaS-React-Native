import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackScreenParamList } from "../navigation/HomeStack";
// Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

type HomeScreenNavigationProp = NativeStackScreenProps<HomeStackScreenParamList, 'Keychain'>

export default function GaleryScreen({ route, navigation }: HomeScreenNavigationProp) {

    // Gestion fichiers
    const win = Dimensions.get('window');
    const widthOneImage = win.width * 0.7;
    const widthMultipleImage = win.width * 0.5 - 15;

    // Utilisation de l'identifiant du user pour accéder à son répertoire des photos
    let userAuth = auth().currentUser;
    let imageDirectory = 'galery/' + userAuth?.uid + '/';

    let [images, setImages] = useState<string[]>([]);

    useEffect(() => {

        // Rustine invisible pour l'utilisateur, mais en dév si on fait un CTRL+S, ca concatène
        // les images à chaque fois et on arrive à énormément d'images
        setImages([]);

        // Récupération des images sur Firestore
        storage()
            .ref(imageDirectory)
            .listAll()
            .then(function (result) {
                result.items.forEach(function (imageRef) {
                    imageRef.getDownloadURL().then(function (url) {

                        setImages(previous => [...previous, url]);

                    }).catch(function (error) {
                        // Handle any errors
                    });
                });
            })
            .catch((e) => console.log('Erreur pendant le téléchargement => ', e));
    }, []);

    return (
        <View style={styles.container}>
            {
                images?.length < 1 && <Text style={styles.title}>Photos stockées dans Firebase : aucune</Text>
            }
            <ScrollView style={{ flex: 1 }}>
                <View style={[styles.containerImage, images?.length === 1 && { alignSelf: 'center' }]}>
                    {/* Si 1 image, l'affiche en grand et centrée. Sinon, 2 par 2 par ligne. */}
                    {
                        images.map((item, index) => {
                            return (
                                <View key={index} style={styles.image}>
                                    <Image
                                        resizeMode="cover"
                                        resizeMethod="scale"
                                        style={{
                                            width: images?.length === 1 ? widthOneImage : widthMultipleImage,
                                            height: images?.length === 1 ? widthOneImage : widthMultipleImage
                                        }}
                                        source={{ uri: item }}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>

            <View style={styles.containerButtons}>
                <Pressable onPress={() => navigation.navigate('UploadPhoto')}>
                    <View style={styles.button}>
                        <Icon name="image-search" size={28} color="white" />
                        <Text style={styles.textButton}>Importer</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerButtons: {
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginTop: 10,
        flexDirection: 'row',
        height: 100,
    },
    containerImage: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    image: {
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
    },
    button: {
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
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
        paddingLeft: 5,
    },
    title: {
        margin: 10,
        fontSize: 16,
    }
});

