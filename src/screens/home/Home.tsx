import Mascot from '@assets/logo/Mascot';
import Typography from '@components/typography';
import { useTheme } from '@providers/theme';
import { routes, ScreenType } from '@routes';
import { Button, View } from 'react-native';
import Animated from 'react-native-reanimated';

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const theme = useTheme();

  const ball = (
    <View
      style={{
        width: 6,
        height: 6,
        backgroundColor: theme.colors.foreground.light,
        borderRadius: '100%',
      }}
    />
  );
  return (
    <View
      style={{
        backgroundColor: theme.colors.background.default,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Animated.View sharedTransitionTag="heythere">
          <Mascot />
        </Animated.View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Typography title light>
            absolute
          </Typography>
          <Typography display>CINEMA</Typography>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography title>just</Typography>
            {ball}
            <Typography title>a</Typography>
            {ball}
            <Typography title>movie</Typography>
            {ball}
            <Typography title>app</Typography>
          </View>
        </View>

        <Button
          title="Movie"
          onPress={() => navigation.navigate(routes.movie)}
        />
      </View>
    </View>
  );
};

export default Home;
