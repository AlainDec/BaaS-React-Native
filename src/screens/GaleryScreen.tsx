import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Icônes
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GaleryScreen() {

    const win = Dimensions.get('window');
    const widthOneImage = win.width * 0.7;
    const widthMultipleImage = win.width * 0.5 - 15;

    const [response, setResponse] = useState<any>(null);

    const transfertToFirestore = () => {
        console.log("Transfert démarré");
    }
    
    useEffect( () => {
        if (response !== undefined) {
            // Stockage des images dans Firestore
        }
    }, [response])

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                {/* Si 1 image, l'affiche en grand et centrée. Sinon, 2 par 2 par ligne. */}
                <View style={[styles.containerImage, response?.assets.length === 1 && { alignSelf: 'center'}]}>
                    {
                        response?.assets &&
                        response?.assets.map(({ uri }: any) => (
                            <View key={uri} style={styles.image}>
                                <Image
                                    resizeMode="cover"
                                    resizeMethod="scale"
                                    style={{ 
                                        width: response.assets.length === 1 ? widthOneImage : widthMultipleImage,
                                        height: response.assets.length === 1 ? widthOneImage : widthMultipleImage
                                    }}
                                    source={{ uri: uri }}
                                />
                            </View>
                        ))
                    }
                </View>
            </ScrollView>

            <View style={styles.containerButtons}>
                <Pressable onPress={() => {
                    launchImageLibrary({
                        selectionLimit: 0,
                        mediaType: 'photo',
                        includeBase64: false,
                    }, setResponse);
                }}>
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
});

