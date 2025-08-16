import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, StackProps } from '@routes';

import Home from '@screens/home';
import Movie from '@screens/movie';

const Stack = createNativeStackNavigator<StackProps>();

const screenOptions = {
  // tabBarHideOnKeyboard: true,
  headerShown: false,
};

const Navigation = (
  <NavigationContainer>
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={routes.home} component={Home} />
      <Stack.Screen name={routes.movie} component={Movie} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
