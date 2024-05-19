import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://192.168.0.26:8000/api',
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
        return error.response
    }
);


// const handleError = async (response) => {
//     const { status } = response;

//     switch (status) {
//         case 401:
//             if (response.data.message == "Unauthenticated.") {
//                 await AsyncStorage.clear();
//                 console.log('Sessão expirada. Por favor, faça login novamente.')
//             } else {
//                 // messageError(
//                 //     response,
//                 //     response.data.message,
//                 //     response.data.title,
//                 //     response.data.type
//                 // );
//             }
//             break;
//         case 500:
//             console.log('Erro de servidor. Tente novamente mais tarde.')
//             break;
//     }
// }

export default api;