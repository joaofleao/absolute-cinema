import { Button, Image, View } from 'react-native'

import { useTheme } from '@providers/theme'
import { ScreenType } from '@router'

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Movie: ScreenType<'movie'> = ({ navigation, route }) => {
  const theme = useTheme()

  // const { mediaUrl, mediaSpecs } = route.params;

  // const animatedStyle = useAnimatedStyle(() => ({
  //   position: 'absolute',
  //   alignItems: 'center',

  //   top: interpolate(animated.value, [0, 1], [mediaSpecs.pageY - y.value, 0]),
  //   left: interpolate(animated.value, [0, 1], [mediaSpecs.pageX - x.value, 0]),
  //   width: interpolate(
  //     animated.value,
  //     [0, 1],
  //     [mediaSpecs.width, SCREEN_WIDTH]
  //   ),
  //   height: interpolate(
  //     animated.value,
  //     [0, 1],
  //     [mediaSpecs.height, SCREEN_HEIGHT]
  //   ),
  //   borderRadius: interpolate(
  //     animated.value,
  //     [0, 1],
  //     [mediaSpecs.borderRadius, 0]
  //   ),
  //   transform: [{ translateX: x.value }, { translateY: y.value }],
  //   overflow: 'hidden',
  // }));

  return (
    <View
      style={{
        backgroundColor: theme.colors.background.default,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* <Reanimated.View style={StyleSheet.absoluteFill}> */}
      {/* <Reanimated.View style={animatedStyle} onTouchEnd={handleGoBack}> */}
      <Image
        style={{
          aspectRatio: 9 / 16,
          height: 400,
          borderRadius: 20,
        }}
        source={require('@assets/movie.png')}
        resizeMode="cover"
      />

      <Button
        color={theme.colors.foreground.light}
        title="Home"
        onPress={() => navigation.goBack()}
      />
      {/* </Reanimated.View> */}
      {/* </Reanimated.View> */}
    </View>
  )
}

export default Movie
