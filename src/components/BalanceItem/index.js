import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'


export default function BalanceItem({ data }) {

    const labelName = useMemo(() => {
        if (data.tag == 'saldo') {
            return {
                label: 'Saldo atual',
                color: '3b3bbf'
            }
        } else if (data.tag == 'receita') {
            return {
                label: 'Entradas de hoje',
                color: '00b94a'
            }
        } else {
            return {
                label: 'Saidas de hoje',
                color: 'ef463a'
            }
        }
    }, [data])

    return (
        <View style={[styles.container, { backgroundColor: `#${labelName.color}` }]}>
            <Text style={styles.label}> {labelName.label} </Text>
            <Text style={styles.balance}>R$ {data.saldo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 14,
        marginRight: 14,
        borderRadius: 4,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 300,
        paddingLeft: 14,
    },
    label: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold'
    },
    balance: {
        marginTop: 5,
        fontSize: 30,
        color: '#fff',
    }
})