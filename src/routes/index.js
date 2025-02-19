import React, { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes.stack";
import { AuthContext } from "../contexts/auth";



function Routes() {

    const { signed, loading } = useContext(AuthContext)


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
