import { TestIds } from 'react-native-google-mobile-ads';

export const adUnitIds = {
  BANNER: __DEV__ ? TestIds.BANNER :  TestIds.BANNER,
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'seu-id-real-interstitial',
  REWARDED: __DEV__ ? TestIds.REWARDED : TestIds.REWARDED,
  // REWARDED_INTERSTITIAL: __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'seu-id-real-rewarded-interstitial',
}; 