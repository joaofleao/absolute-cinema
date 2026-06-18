import React from 'react'
import { Appearance, Button, Image, Platform, StatusBar, View } from 'react-native'
import * as Fonts from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { use as run } from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import useStyles from './styles'
import { StackProps } from './types'
import { IconBookmarks, IconFilm } from '@components/icon'
import NavBar from '@components/nav_bar'
import { useSettings } from '@providers/settings'
import { fontImports, useTheme } from '@providers/theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Auth from '@screens/auth'
import Movie from '@screens/movie'
import Onboarding from '@screens/onboarding'
import PasswordRecovery from '@screens/password_recovery'
import Profile from '@screens/profile'
import Search from '@screens/search'
import WatchedMovie from '@screens/watched_movie'
import WatchedMovies from '@screens/watched_movies'
import Watchlist from '@screens/watchlist'
import enUS from '@translations/locales/en_US.json'
import ptBR from '@translations/locales/pt_BR.json'
import print from '@utils/print'

const Tabs = createNativeBottomTabNavigator()

const Stack = createNativeStackNavigator<StackProps>()
// const Tabs = createBottomTabNavigator<StackProps>()

const initI18n = async (): Promise<void> => {
  const lng = SecureStore.getItem('language') ?? 'en_US'
  run(initReactI18next).init({
    resources: {
      pt_BR: ptBR,
      en_US: enUS,
    },
    lng,
    interpolation: { escapeValue: false },
  })
}

initI18n()

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})
SplashScreen.hideAsync()

const Router = (): React.ReactNode => {
  const [appReady, setAppReady] = React.useState(false)
  const { semantics, primitives, fonts } = useTheme()
  const { setViewMode, viewMode } = useSettings()
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

  const HomeStack = (): React.ReactElement => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: semantics.background.base.default,
          },
        }}
      >
        <Stack.Screen
          options={{
            headerTitle: '',
            headerShown: true,
            headerTransparent: true,
            unstable_headerRightItems: () => [
              {
                type: 'menu',
                label: 'View Mode',
                icon: {
                  type: 'sfSymbol',
                  name: viewMode === 'gallery' ? 'rectangle.grid.3x2' : 'rectangle.grid.1x2',
                },
                menu: {
                  items: [
                    {
                      type: 'action',
                      label: 'List',
                      icon: {
                        type: 'sfSymbol',
                        name: 'rectangle.grid.1x2',
                      },
                      onPress: (): void => setViewMode('list'),
                    },
                    {
                      type: 'action',
                      label: 'Gallery',
                      icon: {
                        type: 'sfSymbol',
                        name: 'rectangle.grid.3x2',
                      },
                      onPress: (): void => setViewMode('gallery'),
                    },
                  ],
                },
              },
            ],
          }}
          component={WatchedMovies}
          name={'movies'}
        />

        <Stack.Screen
          name={'movie'}
          component={Movie}
        />

        <Stack.Screen
          name={'password_recovery'}
          component={PasswordRecovery}
        />

        <Stack.Screen
          name={'watched_movie'}
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
          name={'auth'}
          component={Auth}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            contentStyle: {
              backgroundColor: semantics.container.base.original,
            },
          }}
        />
        <Stack.Screen
          name={'onboarding'}
          component={Onboarding}
          options={{
            animation: 'slide_from_left',
          }}
        />
      </Stack.Navigator>
    )
  }

  const ProfileStack = (): React.ReactElement => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: semantics.background.base.default,
          },
        }}
      >
        <Stack.Screen
          name={'profile'}
          component={Profile}
          options={
            {
              // presentation: 'formSheet',
              // sheetAllowedDetents: 'fitToContents',
              // contentStyle: {
              //   backgroundColor: semantics.container.base.original,
              // },
            }
          }
        />
      </Stack.Navigator>
    )
  }

  const SearchStack = (): React.ReactElement => {
    return (
      <Stack.Navigator
        screenOptions={
          {
            // headerShown: false,
            // contentStyle: {
            //   backgroundColor: semantics.background.base.default,
            // },
          }
        }
      >
        <Stack.Screen
          name={'search'}
          component={Search}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      {/* <StatusBar
      // backgroundColor={semantics.background.base.default}
      // barStyle={'dark-content'}
      /> */}

      <Tabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarMinimizeBehavior: 'onScrollDown',
        }}
      >
        <Tabs.Screen
          name={'home'}
          component={HomeStack}
          options={{
            tabBarLabel: t('overall:movies'),
            tabBarIcon: ({ focused }) => ({
              type: 'sfSymbol',
              name: focused ? 'movieclapper.fill' : 'movieclapper',
            }),
          }}
        />
        <Tabs.Screen
          name={'profile'}
          component={ProfileStack}
          options={{
            tabBarLabel: t('overall:profile'),
            tabBarIcon: ({ focused }) => ({
              type: 'sfSymbol',
              name: focused ? 'person.fill' : 'person',
            }),
          }}
        />
        <Tabs.Screen
          name={'search'}
          component={SearchStack}
          options={{
            tabBarSystemItem: 'search',
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  )
}

export default Router
