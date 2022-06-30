import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// Navigation
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackScreenParamList } from '../types/Navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

const SignInScreen = () => {

    const navigation = useNavigation<HomeScreenNavigationProp>()

    return (
        <View style={styles.container}>
            <Text>Bienvenue !</Text>
        </View>
    )
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#efefef',
        justifyContent: 'space-around',
    },
});