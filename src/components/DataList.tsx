import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { IData } from '../Interfaces';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/*
    // version 1
    const DataList = ({id, email, password, name, type}: TData) => {
        return (
            <Text>{name} *</Text>
        )
    }

    // Version 2
    const DataList = (props: TData) => {
        //const {id, email, password, name, type} = props;
        return (
            <Text>{props.name} *</Text>
        )
    }
*/

const ItemSeparator = () => <View style={{
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.1)",
}} />

// const DataList = (props: IData) => {
const DataList = ({ data, upload }: { data: IData, upload: (id: string) => void }) => {

    // un state individuel pour chaque ligne
    const [eyeToggle, setEyeToggle] = useState(false);

    return (
        <>
            <View style={styles.container} key={data.id}>
                <TouchableOpacity onPress={() => upload(data.id)} style={[styles.row, styles.textLineGlobal]}>
                    <Text style={[styles.textItem, styles.textLine1]}>{data.name}</Text>
                    <Text style={[styles.textItem, styles.textLine2]}>{data.email}</Text>
                    <Text style={[styles.textItem, styles.textLine3]}>{eyeToggle ? data.password : '*'.padStart(data.password.length, '*')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setEyeToggle(!eyeToggle)}
                    style={[styles.row, styles.eyeContainer]}>
                    <Icon name={eyeToggle ? 'eye-off-outline' : 'eye-outline'} size={27} color="tomato" />
                </TouchableOpacity>
            </View>
            <ItemSeparator />
        </>
    );
}

export default DataList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    textItem: {
        color: 'black',
        fontSize: 14,
        paddingRight: 0,
        paddingVertical: 8,
    },
    textLineGlobal: {
        flex: 12,
    },
    textLine1: {
        flex: 1,
        backgroundColor: '#eaeaea',
    },
    textLine2: {
        flex: 1.5,
        backgroundColor: '#f5f5f5',
    },
    textLine3: {
        flex: 1.5,
        backgroundColor: '#fffcfc',
    },
    row: {
        flexDirection: 'row',
    },
    eyeContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 7
    }
});