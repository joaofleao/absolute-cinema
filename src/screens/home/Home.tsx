import { ScreenType } from '@routes';
import { Text, View } from 'react-native';

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Home Screen</Text>
    </View>
  );
};

export default Home;
