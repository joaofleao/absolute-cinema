import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  logo: ImageStyle
  title: ViewStyle

  content: ViewStyle
  gradient: ViewStyle
  gradientContainer: ViewStyle
  footer: ViewStyle
  header: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { width } = Dimensions.get('window')
  const { top, bottom } = useSafeAreaInsets()

  return StyleSheet.create({
    logo: {
      width: 153,
      height: 118,
    },

    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      minHeight: 200,
      justifyContent: 'center',
    },
    gradientContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: -width / 2,
    },
    gradient: {
      height: width * 2,
      width: width,
    },
    footer: {
      position: 'absolute',
      bottom,
      paddingHorizontal: 16,
      width: '100%',
    },
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      position: 'absolute',
      top,
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: '100%',
      alignSelf: 'flex-end',
    },
  })
}

export default useStyles
