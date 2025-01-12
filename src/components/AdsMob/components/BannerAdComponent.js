import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitIds } from '../config/adUnitIds';
import { usePayment } from '../../../contexts/PaymentContext';

export function BannerAdComponent() {
  const { isPaymentActive, isLoading } = usePayment();

  if (isLoading || isPaymentActive) {
    return null;
  }
  
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={adUnitIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
}); 