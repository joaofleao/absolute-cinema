import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import * as Fonts from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// import Navigation from './Navigation';
import useStyles from './styles';
// import ToastNotification from '@components/ToastNotification';
// import LoadingModal from '@containers/LoadingModal';
import { useTheme } from '@providers/theme';
import print from '@utils/print';
import Navigation from './Navigation';
import { fontImports } from '@providers/theme';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const Router = (): React.ReactElement => {
  const [appIsReady, setAppIsReady] = React.useState(true);

  // const announcements = useAnnouncements()

  const styles = useStyles();

  const { colors } = useTheme();

  React.useEffect(() => {
    async function prepare(): Promise<void> {
      try {
        await Fonts.loadAsync(fontImports);
        await new Promise(resolve => {
          return setTimeout(resolve, 2000);
        });
      } catch (e: any) {
        print('error on start', e, 'blue');
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(() => {
    if (appIsReady) SplashScreen.hide();
  }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={colors.background.default}
        barStyle={'light-content'}
      />

      {/* <LoadingModal /> */}
      {/* <NewVersionModal /> */}
      {/* <NetworkModal /> */}
      {/* <ToastNotification /> */}

      <View onLayout={onLayoutRootView} style={styles.container}>
        {Navigation}
      </View>
    </>
  );
};

export default Router;
