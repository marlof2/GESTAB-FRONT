import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import api from "../../services";

async function LinkCheckoutMercadoPago(data) {
    try {
        const response = await api.post('/payments/createPreference', data);

        // Tenta abrir primeiro no navegador in-app
        try {
            return response.data.init_point

        } catch (browserError) {
            console.error('Erro ao processar pagamento:', browserError);
            throw browserError;
        }

    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        throw error;
    }
}

export default LinkCheckoutMercadoPago