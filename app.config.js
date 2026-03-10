/**
 * Configuração dinâmica do Expo
 * Usa variáveis de ambiente para chaves sensíveis (Google Maps)
 */

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default {
  expo: {
    name: 'edusenac',
    slug: 'edusenac',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/senac_logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/senac_logo.png',
          backgroundColor: '#ffffff',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'O app precisa da sua localização para registrar presença nas aulas.',
      },
      config: googleMapsApiKey
        ? {
            googleMapsApiKey,
          }
        : undefined,
    },
    android: {
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: googleMapsApiKey
        ? {
            googleMaps: {
              apiKey: googleMapsApiKey,
            },
          }
        : undefined,
      adaptiveIcon: {
        backgroundColor: '#EDEEF6',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};
