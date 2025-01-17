import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, View } from "react-native";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes.stack";
import { AuthContext } from "../contexts/auth";
import { setSessionExpired } from '../store/globalSlice';



function Routes() {

    const { signed, loading, signOut } = useContext(AuthContext)
    const dispatch = useDispatch();
    const isSessionExpired = useSelector(state => state.global.auth.isSessionExpired);

    useEffect(() => {
        if (isSessionExpired) {
            signOut();
            dispatch(setSessionExpired(false));
        }



    }, [isSessionExpired]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4ff" }}>
                <ActivityIndicator size="large" color="#131313" />
            </View>
        )
    }
    return (
        signed ? <AppRoutes /> : <AuthRoutes />
    );


}
export default Routes;
