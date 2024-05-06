import React from 'react'
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from '../pages/Home'
import Fila from '../pages/Fila'
import CustomDrawer from '../components/CustomDrawer';

const AppDrawer = createDrawerNavigator();

function AppRoutes() {
    return (
        <AppDrawer.Navigator
            drawerContent={(props) => <CustomDrawer{...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#fff',
                    paddingTop: 20,
                },
                drawerActiveBackgroundColor: '#366AA2',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#000',
            }}
        >
            <AppDrawer.Screen
                name="Home"
                component={Home}
            />

            <AppDrawer.Screen
                name="Fila"
                component={Fila}
            />
        </AppDrawer.Navigator>
    )
}

export default AppRoutes;