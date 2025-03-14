import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import api from "../../services";

async function CheckoutMercadoPago(data) {
    try {
        const response = await api.post('/payments/createPreference', data);

        if (response.data.init_point) {
            // Tenta abrir primeiro no navegador in-app
            try {
                await WebBrowser.openAuthSessionAsync(
                    response.data.init_point,
                    'com.marlof2.gestab', // Substitua pelo seu scheme de redirecionamento
                    {
                        showInRecents: true,
                        createTask: true,
                        enableDefaultShare: false,
                        showTitle: true,
                        controlsColor: '#2196F3',
                        toolbarColor: '#FFFFFF',
                    }
                );
            } catch (browserError) {
                // Se falhar, tenta abrir no navegador padrão
                const canOpen = await Linking.canOpenURL(response.data.init_point);
                if (canOpen) {
                    await Linking.openURL(response.data.init_point);
                } else {
                    throw new Error('Não foi possível abrir o link de pagamento');
                }
            }
        }

    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        throw error;
    }
}

export default CheckoutMercadoPago