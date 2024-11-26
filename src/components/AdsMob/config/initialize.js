import mobileAds from 'react-native-google-mobile-ads';

export function initializeAdMob() {
  mobileAds()
    .initialize()
    .then(() => {
    //   console.log('SDK de Anúncios inicializado!');
    });
} 