import React from 'react'
import { StatusBar, View } from 'react-native'
import * as Fonts from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import * as SplashScreen from 'expo-splash-screen'
import { use as run } from 'i18next'
import { initReactI18next } from 'react-i18next'

import useStyles from './styles'
import { StackProps } from './types'
import enUS from '@i18n/locales/en-us.json'
import ptBR from '@i18n/locales/pt-br.json'
import { fontImports, useTheme } from '@providers/theme'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from '@router'
import Home from '@screens/home'
import Login from '@screens/login'
import Movie from '@screens/movie'
import PasswordRecovery from '@screens/password_recovery'
import Search from '@screens/search/search'
import SignUp from '@screens/sign_up'
import print from '@utils/print'

const Stack = createNativeStackNavigator<StackProps>()

const screenOptions = {
  // tabBarHideOnKeyboard: true,
  headerShown: false,
}

const resources = {
  'pt-BR': ptBR,
  'en-US': enUS,
}

const initI18n = async (): Promise<void> => {
  // const json = await AsyncStorage.getItem('userData')
  // const savedLanguage = JSON.parse(json)?.language

  // if (!user.language) {
  //   savedLanguage = Localization.locale
  // }

  run(initReactI18next).init({
    // compatibilityJSON: 'v3',
    resources,
    // lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

const Router = (): React.ReactNode => {
  const [appReady, setAppReady] = React.useState(false)
  const { colors } = useTheme()
  const styles = useStyles()

  React.useEffect(() => {
    async function prepare(): Promise<void> {
      try {
        await Fonts.loadAsync(fontImports)
        await new Promise((resolve) => {
          return setTimeout(resolve, 2000)
        })
      } catch (e: any) {
        print('error on start', e, 'blue')
      } finally {
        setAppReady(true)
      }
    }

    prepare()
  }, [])

  if (!appReady) return null

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor={colors.background.default}
        barStyle={'light-content'}
      />

      <View
        style={styles.container}
        onLayout={SplashScreen.hideAsync}
      >
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name={routes.home}
            component={Home}
          />
          <Stack.Screen
            name={routes.login}
            component={Login}
          />
          <Stack.Screen
            name={routes.movie}
            component={Movie}
          />
          <Stack.Screen
            name={routes.password_recovery}
            component={PasswordRecovery}
          />
          <Stack.Screen
            name={routes.search}
            component={Search}
          />
          <Stack.Screen
            name={routes.sign_up}
            component={SignUp}
          />
        </Stack.Navigator>

        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.60)',
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0)',
          ]}
          style={styles.topBlur}
        />
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.60)',
          ]}
          style={styles.bottomBlur}
        />
      </View>
    </NavigationContainer>
  )
}

export default Router
