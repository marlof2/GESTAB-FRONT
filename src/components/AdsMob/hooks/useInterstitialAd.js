import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { InterstitialAd } from 'react-native-google-mobile-ads';
import { adUnitIds } from '../config/adUnitIds';

export function useInterstitialAd() {
    const [interstitialAd, setInterstitialAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadAd = async () => {
        try {
            const interstitial = InterstitialAd.createForAdRequest(adUnitIds.INTERSTITIAL, {
                requestNonPersonalizedAdsOnly: true,
                keywords: ['fashion', 'clothing'],
            });

            interstitial.load();
            setInterstitialAd(interstitial);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao carregar anúncio intersticial:', error);
            setIsLoading(false);
        }
    };

    const showAd = async () => {
        if (!interstitialAd) {
            Alert.alert('Erro', 'Anúncio não está pronto');
            return;
        }

        try {
            await interstitialAd.show();
            setInterstitialAd(null);
            loadAd();
        } catch (error) {
            console.error('Erro ao mostrar intersticial:', error);
            Alert.alert('Erro', 'Falha ao mostrar o anúncio');
        }
    };

    useEffect(() => {
        loadAd();
    }, []);

    return { showAd, isLoading };
} 