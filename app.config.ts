import { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.APP_ENV === 'production'

  return {
    ...config,
    name: isProduction ? 'Absolute Cinema' : 'Absolute Development',
    slug: 'absolute-cinema',
    version: '1.0',
    orientation: 'portrait',
    icon: './src/assets/app/icon.png',
    newArchEnabled: true,
    plugins: [
      [
        'expo-splash-screen',
        {
          backgroundColor: 'hsl(0, 100%, 20%)',
          image: './src/assets/app/splash-icon.png',
          dark: {
            image: './src/assets/app//splash-icon-dark.png',
            backgroundColor: 'hsl(0, 100%, 5%)',
          },
          imageWidth: 440,
          resizeMode: 'contain',
        },
      ],
      'expo-secure-store',
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: isProduction
        ? 'com.joaofleao.absolute-cinema'
        : 'com.joaofleao.absolute-cinema.dev',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        light: './src/assets/app/icon.png',
        dark: './src/assets/app/icon-dark.png',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/app/adaptive-icon.png',
        backgroundColor: 'hsl(0, 100%, 20%)',
      },
      edgeToEdgeEnabled: true,
      package: 'com.joaofleao.absolutecinema',
    },
    web: {
      favicon: './src/assets/app/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'f469e399-cb7d-475c-a9e7-d4a1a675cfbf',
      },
    },
  }
}
