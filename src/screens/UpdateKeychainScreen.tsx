import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AddUpdateKeychainForm } from '../components/AddUpdateKeychainForm';

const UpdateKeychainScreen = (itemId: string) => {
    return (
        <View style={styles.container}>
            <AddUpdateKeychainForm formType='add' itemId={itemId} />
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