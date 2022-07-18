import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AddUpdateKeychainForm } from '../components/AddUpdateKeychainForm';

type propsRoute = {
    itemId: string;
}

const UpdateKeychainScreen = ({ route }: propsRoute) => {

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