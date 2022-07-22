import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable, Dimensions, Platform, Alert, PermissionsAndroid } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

export default function UploadPhotoScreen() {

    // Calibrage photos
    const win = Dimensions.get('window');
    const widthOneImage = win.width * 0.7;
    const widthMultipleImage = win.width * 0.5 - 15;

    // Transfert vers firestore
    //const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    // Réponse sélection photos dans la galerie
    const [responsePhoto, setResponsePhoto] = useState<any>(null);

    // Utilisation de l'identifiant du user pour accéder à son répertoire des photos
    let userAuth = auth().currentUser;
    let imageDirectory = 'galery/' + userAuth?.uid + '/';

    const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Vous pouvez utiliser l\'appareil photo");
          } else {
            console.log("Appareil poto : permission refusée");
          }
        } catch (err) {
          console.warn(err);
        }
      };

    const uploadImage = async () => {

        // Gestion fichiers
        const uri = responsePhoto.assets[0].uri;
        const filename = responsePhoto.assets[0].fileName;
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        // Activation de la progress bar
        setUploading(true);
        setTransferred(0);
        
        const task = storage()
            .ref(imageDirectory + filename)
            .putFile(uploadUri);

        // Barre de progression
        task.on('state_changed', snapshot => {
            setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            );
        });
        try {
            await task;
        } catch (e) {
            console.error(e);
        }

        setUploading(false);
        Alert.alert(
            'Transfert terminé',
            'Votre photo vient d\'être téléversée sur Firebase Cloud Storage.'
        );

        // TODO : redirect vers page précédente
    };

    useEffect(() => {

        requestCameraPermission();

        if (responsePhoto === null || responsePhoto?.assets?.length === 0) {
            console.log("tout est vide");
        }
        if (responsePhoto === null) {
            // Affichage de la galerie photo du téléphone
            launchImageLibrary({
                selectionLimit: 0,
                mediaType: 'photo',
                includeBase64: false,
            }, setResponsePhoto)
        }
    }, [responsePhoto])

    console.log(responsePhoto);

    return (
        <View style={styles.container}>
            {/* Si 1 image, l'affiche en grand et centrée. Sinon, 2 par 2 par ligne. */}
            {
                //responsePhoto === null || responsePhoto?.assets?.length === 0 || responsePhoto === undefined ? (
                responsePhoto === null || responsePhoto.didCancel === true ? (

                    <Text style={styles.title}>Pas d'image sélectionnée</Text>

                ) : (

                    <>
                        <Text style={styles.title}>{responsePhoto?.assets?.length} photo(s) sélectionnée(s)</Text>

                        <ScrollView style={{ flex: 1 }}>
                            <View style={[styles.containerImage, responsePhoto?.assets.length === 1 && { alignSelf: 'center' }]}>
                                {
                                    responsePhoto?.assets &&
                                    responsePhoto?.assets.map(({ uri }: any) => (
                                        <View key={uri} style={styles.image}>
                                            <Image
                                                resizeMode="cover"
                                                resizeMethod="scale"
                                                style={{
                                                    width: responsePhoto?.assets.length === 1 ? widthOneImage : widthMultipleImage,
                                                    height: responsePhoto?.assets.length === 1 ? widthOneImage : widthMultipleImage
                                                }}
                                                source={{ uri: uri }}
                                            />
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                    </>
                )
            }
            {
                uploading && (
                    <View style={styles.progressBarContainer}>
                        <Progress.Bar progress={transferred} width={300} />
                    </View>
                )
            }
            <View style={styles.containerButtons}>
                <Pressable onPress={uploadImage}>
                    <View style={styles.button}>
                        <Icon name="transfer-up" size={28} color="white" />
                        <Text style={styles.textButton}>Transférer</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => {
                    launchImageLibrary({
                        selectionLimit: 0,
                        mediaType: 'photo',
                        includeBase64: false,
                    }, setResponsePhoto)
                }}>
                    <View style={styles.button}>
                        <Icon name="folder-multiple-image" size={28} color="white" />
                        <Text style={styles.textButton}>Mes photos</Text>
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
        flex: 1,
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
    },
    progressBarContainer: {
        marginTop: 20
    },
});

