import React, { createContext, useState, useEffect } from "react";
import api from "../services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        loadStorage();

    }, []);


    async function signOut() {
        setLoadingAuth(true);

        try {
            const { status, data } = await api.post('/logout');

            if (status) {
                if (status == 200) {
                    await AsyncStorage.clear()
                        .then(() => {
                            setUser(null)
                        })
                    setLoadingAuth(false);
                }
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
            const { status } = response

            if (status == 401) {
                setLoading(false)
                await AsyncStorage.clear();
                navigation.navigate('SignIn')
                setUser(null);
            }

            if (status == 200) {
                setUser(response.data);
                setLoading(false)
            }
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
                navigation.navigate('SignIn')
                setLoadingAuth(false);
            }


        } catch (error) {
            console.log('erro ao cadastrar', error)
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loadStorage, loadingAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;

