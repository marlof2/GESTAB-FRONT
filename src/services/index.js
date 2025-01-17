import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { Alert } from 'react-native';
import { store } from '../store';
import { setSessionExpired } from '../store/globalSlice';


const api = axios.create({
    baseURL:  process.env.EXPO_PUBLIC_API_URL
})


api.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');


        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



api.interceptors.response.use(
    response => response,
    error => handleError(error.response)
);


const handleError = async (response) => {
    const { status, data } = response;
    let bodyMessage = "";

    switch (status) {
        case 401:
            store.dispatch(setSessionExpired(true));
            return Promise.reject(response);
        case 406:
            if (data.message == "Usuário ou Senha Inválido.") {
                return AlertModal('Atenção!', data.message)
            }


            if (data.error) {
                const plural = data.error.length > 1

                Object.keys(data.error).forEach((item) => {
                    if (plural)
                        bodyMessage += `${data.error[item]}, `;
                    else
                        bodyMessage += `${data.error[item]} `;
                });

                AlertModal('Atenção!', bodyMessage)
            }
            break;
        case 404:
            if (data.message == "Usuario não encontrado na base de dados.") {
                return AlertModal('Atenção!', data.message)
            }
            break;
        case 500:
            return AlertModal('Atenção!', 'Erro interno, Tente novamente mais tarde.')
        default: return response
    }
}



const AlertModal = (title = 'Atenção!', text) => {
    return Alert.alert(
        title,
        text,
        [
            { text: 'OK' },
        ],
    );
}



export default api;