import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#6646ee' />
        </View>
    );
}

export default Loading;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});