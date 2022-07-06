import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AddUpdateKeychainForm } from '../components/AddUpdateKeychainForm';

const AddKeychainScreen = () => {
    return (
        <View style={styles.container}>
            <AddUpdateKeychainForm formType='add' />
        </View>
    )
}

export default AddKeychainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
        justifyContent: 'space-around',
    },
});