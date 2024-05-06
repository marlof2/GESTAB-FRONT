import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../../contexts/auth";


import styles from "./styles";
import Header from "../../components/Header";
import api from "../../services";
import { format } from "date-fns";
import { useIsFocused } from '@react-navigation/native'
import BalanceItem from "../../components/BalanceItem";


export default function Home() {
    const [listBalance, setListaBalance] = useState([])
    const [dateMovements, setDateMoviments] = useState(new Date())
    const isFocused = useIsFocused()

    useEffect(() => {
        let isActived = true;

        async function getMoviments() {

            let formatDate = format(dateMovements, "dd-MM-yyyy")

            const balance = await api.get('/balance', { params: { date: formatDate } })
            setListaBalance(balance.data)
        }

        if (isFocused) {
            getMoviments()
        }

        return () => {
            isActived = false
        }

    }, [isFocused])
    return (
        <SafeAreaView style={styles.background}>
            <Header title="Home" />

            <FlatList style={styles.flatList}
                data={listBalance}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.tag}
                renderItem={({ item }) => (<BalanceItem data={item} />)}
            />

        </SafeAreaView>
    )
}

