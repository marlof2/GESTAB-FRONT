import React, { createContext, useState, useEffect } from "react";
import api from "../services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setSnackbar } from '../store/globalSlice';
import { useDispatch } from 'react-redux';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const initializeGoogleSignin = async () => {
        try {
            await GoogleSignin.configure({
                webClientId: '161091673023-r5oc4i2tqf4rkffpf8bo3cj5hv1jahlt.apps.googleusercontent.com',
                scopes: ['email', 'profile']
            });
        } catch (error) {
            console.error('Erro ao configurar Google Sign-In:', error);
        }
    };

    useEffect(() => {
        initializeGoogleSignin();
        loadStorage();
    }, []);

    async function handleGoogleSignIn() {
        setLoadingAuth(true);
        try {
            try {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            } catch (error) {
                console.error('Play Services error:', error);
                if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    dispatch(setSnackbar({
                        visible: true,
                        title: 'Google Play Services não está disponível ou atualizado'
                    }));
                }
                throw error;
            }

            try {
                // await GoogleSignin.signOut();

                const userInfo = await GoogleSignin.signIn();
                console.log('UserInfo:', userInfo);

                const response = await api.post('/google/callback', {
                    id_token: userInfo.idToken,
                    user: {
                        email: userInfo.user.email,
                        name: userInfo.user.name,
                        photo: userInfo.user.photo
                    }
                });

                console.log('API Response:', response);

                if (response.status === 200) {
                    const { token, user: userData } = response.data;

                    await AsyncStorage.setItem('token', token);
                    api.defaults.headers['Authorization'] = `Bearer ${token}`;

                    setUser(userData);
                    loadStorage();

                    dispatch(setSnackbar({
                        visible: true,
                        title: 'Login realizado com sucesso!'
                    }));
                }
            } catch (error) {
                console.error('Sign in error:', error);
                throw error;
            }

        } catch (error) {
            console.error('Erro no login com Google:', error);
            let errorMessage = 'Erro ao fazer login com Google';

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                errorMessage = 'Login cancelado';
            } else if (error.code === statusCodes.IN_PROGRESS) {
                errorMessage = 'Login já em andamento';
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                errorMessage = 'Google Play Services não disponível';
            } else if (error.code === 'DEVELOPER_ERROR') {
                errorMessage = 'Erro de configuração do Google Sign-In';
            }

            dispatch(setSnackbar({
                visible: true,
                title: errorMessage
            }));
        } finally {
            setLoadingAuth(false);
        }
    }

    async function signOut() {
        setLoadingAuth(true);

        try {
            const response = await api.post('/logout');

            if (response.status == 401 || response.status == 200) {
                await AsyncStorage.clear()
                    .then(() => {
                        setUser(null)
                    })
                setLoadingAuth(false);
            }
        } catch (error) {
            console.log('erro ao logar', error)
            setLoadingAuth(false);
        }
    }

    async function loadStorage() {
        const token = await AsyncStorage.getItem('token');
        if (token != null) {
            setLoading(true)
            const response = await api.get('/me')

            if (response.status == 401) {
                setLoading(false)
                setUser(null);
                await AsyncStorage.clear();
            }

            if (response.status == 200) {
                setUser(response.data);
                setLoading(false)
            }
        } else {
            setUser(null)
            setLoading(false)
            await AsyncStorage.clear();
        }
    }

    async function signIn(obj) {
        setLoadingAuth(true);

        try {
            const { status, data } = await api.post('/login', obj);

            if (status) {
                if (status == 200) {
                    const { token, user } = data

                    await AsyncStorage.setItem('token', token);

                    api.defaults.headers['Authorization'] = `Bearer ${token}`;

                    setUser(user);
                    setLoadingAuth(false);
                    loadStorage()
                }

                setLoadingAuth(false);
            }
        } catch (error) {
            console.log('erro ao logar', error)
            setLoadingAuth(false);
        }
    }

    async function signUp(obj) {
        setLoadingAuth(true);
        try {
            if (obj.profile_id == 2) {
                obj.type_schedule = null
            }

            const response = await api.post('/register', obj);
            if (response.status == 201) {
                dispatch(setSnackbar({ visible: true, title: 'Acesso criado com sucesso!' }));

                navigation.navigate('SignIn')
                setLoadingAuth(false);
            }
        } catch (error) {
            console.log('erro ao cadastrar', error)
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            signUp,
            signIn,
            signOut,
            loadStorage,
            loadingAuth,
            loading,
            handleGoogleSignIn
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

