import { ConfigContext, ExpoConfig } from 'expo/config'

const APP_NAME = process.env.APP_NAME || 'Absolute Cinema'
const IOS_BUNDLE_IDENTIFIER = process.env.IOS_BUNDLE_IDENTIFIER || 'com.joaofleao.absolute-cinema'
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || 'com.joaofleao.absolute_cinema'

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: APP_NAME,
    slug: 'absolute-cinema',
    scheme: 'absolute-cinema',
    version: '1.1',
    orientation: 'portrait',
    icon: './src/assets/app/icon.png',
    plugins: [
      'expo-sharing',
      '@react-native-community/datetimepicker',
      'expo-font',
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#660000',
          image: './src/assets/app/splash-icon.png',
          dark: {
            image: './src/assets/app//splash-icon-dark.png',
            backgroundColor: '#1a0000',
          },
          imageWidth: 440,
          resizeMode: 'contain',
        },
      ],
    ],
    ios: {
      usesAppleSignIn: true,
      supportsTablet: true,
      bundleIdentifier: IOS_BUNDLE_IDENTIFIER,

      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.674386239678-bnrobvq969mockak51tqpbgpjb0lu1qq',
            ],
          },
        ],
      },
      icon: {
        light: './src/assets/app/icon.png',
        dark: './src/assets/app/icon-dark.png',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/app/adaptive-icon.png',
        backgroundColor: '#660000',
      },
      package: ANDROID_PACKAGE,
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

// [
//   '@react-native-google-signin/google-signin',
//   {
//     iosUrlScheme: 'com.googleusercontent.apps.674386239678-bnrobvq969mockak51tqpbgpjb0lu1qq',
//   },
// ],
