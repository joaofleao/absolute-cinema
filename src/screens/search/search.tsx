import { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useKeyboardHandler } from 'react-native-keyboard-controller'
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useStyles from './styles'
import SearchInput from '@components/search_input'
import Typography from '@components/typography'
import { ScreenType } from '@router'

const useGradualAnimation = (): { height: SharedValue<number> } => {
  const height = useSharedValue(0)

  const { bottom } = useSafeAreaInsets()

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet'
        height.value = Math.max(event.height - bottom, 0)
      },
    },
    [],
  )
  return { height }
}

const Search: ScreenType<'search'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { height } = useGradualAnimation()
  const keyboardView = useAnimatedStyle(() => {
    return { height: Math.abs(height.value) }
  }, [])

  const [searchText, setSearchText] = useState('')

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.root}>
        <View>
          <View style={styles.header}>
            <View style={styles.title}>
              <Typography
                title
                light
              >
                ABSOLUTE CINEMA
              </Typography>
            </View>
          </View>

          <View style={styles.content}>
            <Image
              style={{
                aspectRatio: 9 / 16,
                height: 400,
                borderRadius: 20,
              }}
              source={require('@assets/movie.png')}
              resizeMode="cover"
            />
            <Image
              style={{
                aspectRatio: 9 / 16,
                height: 400,
                borderRadius: 20,
              }}
              source={require('@assets/movie.png')}
              resizeMode="cover"
            />
            <Image
              style={{
                aspectRatio: 9 / 16,
                height: 400,
                borderRadius: 20,
              }}
              source={require('@assets/movie.png')}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <Animated.View style={keyboardView} />
    </View>
  )
}

export default Search
