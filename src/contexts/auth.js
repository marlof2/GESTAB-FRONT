import React, { createContext, useState, useEffect } from "react";
import api from "../services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setSnackbar } from '../store/globalSlice';
import { useDispatch } from 'react-redux';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();



    useEffect(() => {
        loadStorage();

    }, []);


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

    async function signInWithGoogle(data) {
        setLoadingAuth(true);
        try {
            const { token, user, needsProfileCompletion } = data;

            if (needsProfileCompletion) {
                setLoadingAuth(false);
                navigation.navigate('CompleteProfile');
            } else {
                navigation.navigate('Home');
            }

            await AsyncStorage.setItem('token', token);
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            setUser(user);
            setLoadingAuth(false);
            loadStorage();

        } catch (error) {
            console.log('Erro no login com Google:', error);
            dispatch(setSnackbar({
                visible: true,
                title: 'Erro ao fazer login com Google',
                type: 'error'
            }));
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signUp,
                signIn,
                signOut,
                loadStorage,
                loadingAuth,
                loading,
                signInWithGoogle
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;

