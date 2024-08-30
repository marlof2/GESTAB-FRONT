import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { Alert } from 'react-native';


const api = axios.create({
    baseURL: 'https://orange-manatee-370597.hostingersite.com/api'
    // baseURL: 'http://192.168.0.26:8000/api',
})


api.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');


        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // console.log(config)
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



api.interceptors.response.use(
    response => {
        // Qualquer código específico para tratar dados de resposta bem-sucedidos
        return response;
    },
    error => {
        return handleError(error.response)
    }
);


const handleError = async (response) => {
    const { status, data } = response;
    let bodyMessage = "";

    switch (status) {
        case 406:
            if (data.message == "Usuário ou Senha Inválido.") {
                return AlertModal('Atenção!', data.message)
            }


            if (data.error) {
                Object.keys(data.error).forEach((item) => {
                    bodyMessage += `${data.error[item]}, `;
                });

                AlertModal('Atenção', bodyMessage)
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