import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from 'react-native';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';

export type HomeStackScreenParamList = {
    Identification: undefined;
    Inscription: undefined;
    Dashboard: undefined;
};

const Stack = createNativeStackNavigator<HomeStackScreenParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackScreenParamList>

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="Identification">
            <Stack.Screen name="Identification" component={SignInScreen} />
            <Stack.Screen name="Inscription" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
    )
}

export default HomeStack;
