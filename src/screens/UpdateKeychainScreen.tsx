import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AddUpdateKeychainForm } from '../components/AddUpdateKeychainForm';
import { HomeStackScreenParamList } from '../navigation/HomeStack';

type UpdateKeyScreenNavigationProp = NativeStackScreenProps<HomeStackScreenParamList, 'UpdateKeychain'>


const UpdateKeychainScreen = ({ route }: UpdateKeyScreenNavigationProp) => {

    const { itemId } = route.params;

    return (
        <View style={styles.container}>
            <AddUpdateKeychainForm formType='update' itemId={itemId} />
        </View>
    )
}

export default UpdateKeychainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
        justifyContent: 'space-around',
    },
});