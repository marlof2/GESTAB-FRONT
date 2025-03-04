import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";
import api from "../../services";
// import { useEffect, useState } from "react";

async function CheckoutMercadoPago(data) {
    try {
        const response = await api.post('/payments/createPreference', data);

        if (response.data.init_point) {
            await openBrowserAsync(response.data.init_point, {
                presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
                enableDefaultShare: false,
                forceWebView: true,
                showInRecents: true
            });
        }
    } catch (error) {
        console.error('Error opening browser:', error);
    }
}



export default CheckoutMercadoPago