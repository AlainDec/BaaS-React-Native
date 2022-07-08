import React, { useState } from 'react';
import { KeyboardTypeOptions, TextInput, Text, View, StyleSheet } from 'react-native';

interface InputCustomProps {
    placeholder?: string;
    defaultValue?: string;
    value: string;
    password?: boolean;
    keyboard?: KeyboardTypeOptions;
    onChangeText: (value: string) => void;
    onBlur?: () => void;
    error?: boolean;
    errorDetails?: string;
}

export const InputCustom: React.FC<InputCustomProps> = ({
    placeholder,
    defaultValue,
    value,
    password,
    keyboard = 'default',
    onChangeText,
    onBlur,
    error = false,
    errorDetails,
}) => {

    return (
        <View>
            <TextInput
                style={[styles.inputBase, error ? styles.inputError : styles.input]}
                placeholder={placeholder}
                defaultValue={defaultValue}
                value={value}
                // password
                secureTextEntry={password}
                // email {type === "email" ? "email-address" : "default"}
                keyboardType={keyboard}
                // Spécifique password et email
                autoCapitalize='none'
                autoCorrect={false}
                // actions
                onChangeText={onChangeText}
                onBlur={onBlur}
            />
            {!!errorDetails && (
                <Text style={styles.txtError}>{errorDetails}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputBase: {
        marginTop: 30,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    input: {
        borderWidth: 0,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#ac0000',
    },
    txtError: {
      color: '#ac0000',
    }
});
