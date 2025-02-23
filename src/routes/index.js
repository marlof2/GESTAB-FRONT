import React, { useContext } from "react";
import { View } from "react-native";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes.stack";
import { AuthContext } from "../contexts/auth";
import Overlay from "../components/Ui/Overlay";

function Routes() {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#f0f4ff" }}>
                <Overlay isVisible={loading} />
            </View>
        );
    }

    return signed ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
