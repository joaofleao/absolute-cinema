import { useTheme } from '@providers/theme';
import { routes, ScreenType } from '@routes';
import { Button, View } from 'react-native';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import {
  // Reanimated,
  useSharedValue,
  withTiming,
  // interpolate,
  // useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_CONFIG = { duration: 300 };

const Movie: ScreenType<'movie'> = ({ navigation, route }) => {
  const theme = useTheme();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const animated = useSharedValue(0);

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

  const handleGoBack = () => {
    animated.value = withTiming(0, ANIMATION_CONFIG, () => {
      runOnJS(navigation.goBack)();
    });
  };

  useEffect(() => {
    animated.value = withTiming(1, ANIMATION_CONFIG);
  }, []);

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

      <Button title="Home" onPress={() => navigation.goBack()} />
      {/* </Reanimated.View> */}
      {/* </Reanimated.View> */}
    </View>
  );
};

export default Movie;
