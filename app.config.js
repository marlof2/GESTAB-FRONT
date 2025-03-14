export default {
    expo: {
      scheme: 'com.marlof2.gestab',
      web: {
        bundler: 'metro'
      },
      linking: {
        enabled: true,
        prefixes: [
          'com.marlof2.gestab://',
          'https://orange-manatee-370597.hostingersite.com/api/google'
        ],
        config: {
          screens: {
            SignIn: 'SignIn',
            SelectEstablishment: 'SelectEstablishment',
            CompleteProfile: 'CompleteProfile'
          }
        }
      }
    }
  };