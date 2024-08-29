import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../../contexts/auth";


import styles from "./styles";
import Header from "../../components/Header";
// import api from "../../services";
// import { format } from "date-fns";
import { useIsFocused } from '@react-navigation/native'


export default function Home() {
    const isFocused = useIsFocused()

    // useEffect(() => {

    //     if (isFocused) {
    //         getMoviments()
    //     }

    //     return () => {
    //         isActived = false
    //     }

    // }, [isFocused])
    return (
        <SafeAreaView style={styles.background}>
            <Header title="Home" showBack={false} showMenu={true} />
        </SafeAreaView>
    )
}

