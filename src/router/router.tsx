import React from 'react'
import { StatusBar, View } from 'react-native'
import * as Fonts from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import * as SplashScreen from 'expo-splash-screen'

import useStyles from './styles'
import { StackProps } from './types'
import { fontImports, useTheme } from '@providers/theme'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from '@router'
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
        SplashScreen.hide()
      }
    }

    prepare()
  }, [])

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor={colors.background.default}
        barStyle={'light-content'}
      />

      <View style={styles.container}>
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
