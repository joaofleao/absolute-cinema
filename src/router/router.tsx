import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import * as Fonts from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import useStyles from './styles'
import { fontImports, useTheme } from '@providers/theme'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes, StackProps } from '@router'
import Home from '@screens/home'
import Movie from '@screens/movie'
import print from '@utils/print'

const Stack = createNativeStackNavigator<StackProps>()

const screenOptions = {
  // tabBarHideOnKeyboard: true,
  headerShown: false,
}

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

const Router = (): React.ReactNode => {
  const [appIsReady, setAppIsReady] = React.useState(true)
  const styles = useStyles()
  const { colors } = useTheme()

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
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = React.useCallback(() => {
    if (appIsReady) SplashScreen.hide()
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor={colors.background.default}
        barStyle={'light-content'}
      />

      <SafeAreaView
        onLayout={onLayoutRootView}
        style={styles.container}
      >
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name={routes.home}
            component={Home}
          />
          <Stack.Screen
            name={routes.movie}
            component={Movie}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  )
}

export default Router
