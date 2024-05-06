import React from "react";
import { Image, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

export default function CustomDrawer(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{
                width: '100%',
                height: 85,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10
            }}>
                <Image style={{ width: 100, height: 65 }} source={require('../assets/logo1.png')} />

                <Text style={{color:'#000', fontSize:17, marginTop:5, marginBottom:30}}>Bem Vindo!</Text>
            </View>


            <DrawerItemList  {...props} />
        </DrawerContentScrollView>
    )
}