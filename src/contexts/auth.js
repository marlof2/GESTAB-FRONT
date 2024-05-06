import React, { createContext, useState, useEffect } from "react";
import api from "../services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        async function loadStorage() {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                const response = await api.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(async () => {
                    setUser(null)
                })


                api.defaults.headers['Authorization'] = `Bearer ${token}`;
                setUser(response.data);
                setLoading(false)
            }

            setLoading(false)
        }
        loadStorage();
    }, []);


    async function signOut() {

        await AsyncStorage.clear()
            .then(() => {
                setUser(null)
            })
    }

    async function signIn(email, password) {
        setLoadingAuth(true);

        try {
            const response = await api.post('/login', { email, password });
            if (response.status == 200) {

                const data = {
                    ...response.data,
                    email
                }

                await AsyncStorage.setItem('token', data.token);

                api.defaults.headers['Authorization'] = `Bearer ${data.token}`;


                setUser(data);
                setLoadingAuth(false);
            }


        } catch (error) {
            console.log('erro ao logar', error)
            setLoadingAuth(false);
        }
    }

    async function signUp(name, email, password) {
        setLoadingAuth(true);

        try {
            const response = await api.post('/users', { name, email, password });
            if (response.status == 200) {
                navigation.navigate('SignIn')
                setLoadingAuth(false);
            }


        } catch (error) {
            console.log('erro ao cadastrar', error)
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loadingAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;

