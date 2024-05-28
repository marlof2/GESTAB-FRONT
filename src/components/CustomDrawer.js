import React, { useContext } from "react";
import { Image, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { AuthContext } from "../contexts/auth";
import { Card } from "react-native-paper";

export default function CustomDrawer(props) {
    const { user } = useContext(AuthContext);
    const dataUser = user.user
    return (
        <DrawerContentScrollView {...props}>
            <View style={{
                width: '100%',
                height: 85,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10
            }}>
                <Card style={{
                    padding: 10,
                    borderRadius: 15,
                    elevation: 5,
                }}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 17, alignItems: 'center' }}>{dataUser?.name}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

            </View>


            <DrawerItemList  {...props} />
        </DrawerContentScrollView>
    )
}