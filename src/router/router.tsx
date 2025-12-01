import React from 'react'
import { StatusBar, View } from 'react-native'
import * as Fonts from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import * as SplashScreen from 'expo-splash-screen'
import { use as run } from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import useStyles from './styles'
import { StackProps } from './types'
import { IconBookmarks, IconFilm } from '@components/icon'
import NavBar from '@components/nav_bar'
import enUS from '@i18n/locales/en_US.json'
import ptBR from '@i18n/locales/pt_BR.json'
import { fontImports, useTheme } from '@providers/theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from '@router'
import Auth from '@screens/auth'
import Movie from '@screens/movie'
import PasswordRecovery from '@screens/password_recovery'
import Profile from '@screens/profile'
import Search from '@screens/search'
import WatchedMovie from '@screens/watched_movie'
import WatchedMovies from '@screens/watched_movies'
import Watchlist from '@screens/watchlist'
import print from '@utils/print'

const Stack = createNativeStackNavigator<StackProps>()
const Tabs = createBottomTabNavigator<StackProps>()

const initI18n = async (): Promise<void> => {
  // const json = await AsyncStorage.getItem('userData')
  // const savedLanguage = JSON.parse(json)?.language
  // if (!user.language) {
  //   savedLanguage = Localization.locale
  // }
  run(initReactI18next).init({
    resources: {
      pt_BR: ptBR,
      en_US: enUS,
    },
    // lng: savedLanguage,
    fallbackLng: 'en_US',
    interpolation: { escapeValue: false },
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
  const { semantics } = useTheme()
  const styles = useStyles()
  const { t } = useTranslation()

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

  const renderTabs = (): React.ReactElement => {
    return (
      <Tabs.Navigator
        backBehavior="none"
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: semantics.background.base.default,
          },
        }}
        tabBar={(props) => (
          <NavBar
            tabs={[
              { icon: <IconFilm />, label: t('overall:watched'), id: routes.watched },
              { icon: <IconBookmarks />, label: t('overall:watchlist'), id: routes.watchlist },
            ]}
            {...props}
          />
        )}
      >
        <Tabs.Screen
          key={routes.watched}
          name={routes.watched}
          component={WatchedMovies}
        />
        <Tabs.Screen
          key={routes.watchlist}
          name={routes.watchlist}
          component={Watchlist}
        />
      </Tabs.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor={semantics.background.base.default}
        barStyle={'light-content'}
      />

      <View
        style={styles.container}
        onLayout={SplashScreen.hideAsync}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: semantics.background.base.default,
            },
          }}
        >
          <Stack.Screen name={routes.home}>{renderTabs}</Stack.Screen>

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
            options={{
              presentation: 'formSheet',
              sheetExpandsWhenScrolledToEdge: false,
              sheetInitialDetentIndex: 'last',
              sheetAllowedDetents: 'fitToContents',

              contentStyle: {
                backgroundColor: semantics.container.base.original,
              },
            }}
          />

          <Stack.Screen
            name={routes.watched_movie}
            component={WatchedMovie}
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              contentStyle: {
                backgroundColor: semantics.container.base.original,
              },
            }}
          />
          <Stack.Screen
            name={routes.profile}
            component={Profile}
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              contentStyle: {
                backgroundColor: semantics.container.base.original,
              },
            }}
          />

          <Stack.Screen
            name={routes.auth}
            component={Auth}
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              contentStyle: {
                backgroundColor: semantics.container.base.original,
              },
            }}
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
