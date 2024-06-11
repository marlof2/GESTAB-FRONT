import React from 'react'
import Establishment from "../pages/Establishment";
import EstablishmentUser from "../pages/EstablishmentUser/";
import Service from "../pages/Service/";
import EstablishmentUserBindProfessional from "../pages/EstablishmentUser/componets/BindProfessional";
import { createStackNavigator } from '@react-navigation/stack';

import TabRoutes from '../routes/app.routes.tab'

const Stack = createStackNavigator();

function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TabRoutes"
                component={TabRoutes}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Establishment"
                component={Establishment}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="EstablishmentUser"
                component={EstablishmentUser}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="EstablishmentUserBindProfessional"
                component={EstablishmentUserBindProfessional}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="Service"
                component={Service}
                options={{
                    headerShown: false
                }} />

        </Stack.Navigator>
    );
}

export default Routes;