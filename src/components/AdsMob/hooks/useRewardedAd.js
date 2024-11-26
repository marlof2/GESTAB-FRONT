import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { RewardedAd } from 'react-native-google-mobile-ads';
import { adUnitIds } from '../config/adUnitIds';

export function useRewardedAd() {
    const [rewardedAd, setRewardedAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadAd = async () => {
        try {
            const rewarded = RewardedAd.createForAdRequest(adUnitIds.REWARDED, {
                requestNonPersonalizedAdsOnly: true,
                keywords: ['fashion', 'clothing'],
            });

            rewarded.load();
            setRewardedAd(rewarded);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao carregar anúncio recompensado:', error);
            setIsLoading(false);
        }
    };

    const showAd = async () => {
        if (!rewardedAd) {
            Alert.alert('Erro', 'Anúncio não está pronto');
            return;
        }

        try {
            await rewardedAd.show();
            setRewardedAd(null);
            loadAd();
        } catch (error) {
            console.error('Erro ao mostrar anúncio recompensado:', error);
            Alert.alert('Erro', 'Falha ao mostrar o anúncio');
        }
    };

    useEffect(() => {
        loadAd();
    }, []);

    return { showAd, isLoading };
} 