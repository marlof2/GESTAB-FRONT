import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";
import api from "../../services";
// import { useEffect, useState } from "react";

async function CheckoutMercadoPago({ payment_method, user_id, plan_id, establishment_id }) {
    try {
        const response = await api.get('/payments/createPreference', {
            params: {
                payment_method,
                user_id,
                plan_id,
                establishment_id
            }
        });

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