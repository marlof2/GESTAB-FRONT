import React from 'react'
import Establishment from "../pages/Establishment";
import EstablishmentUser from "../pages/EstablishmentUser";
import Service from "../pages/Service/";
import EstablishmentUserBindProfessional from "../pages/EstablishmentUser/componets/BindProfessional";
import MyEstablishments from "../pages/MyEstablishments";
import MyEstablishmentUserBindCliente from "../pages/MyEstablishments/componets/BindClient";
import ListScheduleDay from "../pages/Schedule/components/ListScheduleDay";
import FormSchedule from "../pages/Schedule/components/Form";
import ListProfile from '../pages/Profile/';
import FormProfile from '../pages/Profile/componets/Form';
import FomPasswordChange from '../pages/Profile/componets/FomPasswordChange';
import FinancialReport from '../pages/FinancialReport';
import Feedbacks from '../pages/Feedbacks';
import { createStackNavigator } from '@react-navigation/stack';
import PaymentPlans from '../pages/PaymentsPlans';
import Plans from '../pages/PaymentsPlans/components/Plans';
import { SelectEstablishment } from '../pages/SelectEstablishment';
import { getEstablishment } from "../helpers";
import TabRoutes from '../routes/app.routes.tab'

const Stack = createStackNavigator();


function Routes() {
    const [initialRoute, setInitialRoute] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    async function verifyEstablishmentLogged() {
        try {
            const estabelecimentoLogado = await getEstablishment();
            if (estabelecimentoLogado) {
                if (estabelecimentoLogado.id) {
                    setInitialRoute('TabRoutes');
                }
            } else {
                setInitialRoute('SelectEstablishment');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao verificar estabelecimento:', error);
            setInitialRoute('SelectEstablishment');
            setIsLoading(false);
        }

    }

    React.useEffect(() => {
        verifyEstablishmentLogged();
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
                name="SelectEstablishment"
                component={SelectEstablishment}
                options={{ headerShown: false }}
            />
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

            <Stack.Screen
                name="MyEstablishments"
                component={MyEstablishments}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="MyEstablishmentUserBindCliente"
                component={MyEstablishmentUserBindCliente}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="ListScheduleDay"
                component={ListScheduleDay}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="FormSchedule"
                component={FormSchedule}
                options={{
                    headerShown: false
                }} />

            <Stack.Screen
                name="ListProfile"
                component={ListProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="FormProfile"
                component={FormProfile}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="FomPasswordChange"
                component={FomPasswordChange}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="FinancialReport"
                component={FinancialReport}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Feedbacks"
                component={Feedbacks}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="PaymentPlans"
                component={PaymentPlans}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Plans"
                component={Plans}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    );
}

export default Routes;