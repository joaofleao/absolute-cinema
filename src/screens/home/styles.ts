import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  logo: ImageStyle
  title: ViewStyle
  banner: ViewStyle
  content: ViewStyle
  gradient: ViewStyle
  gradientContainer: ViewStyle
  footer: ViewStyle
  header: ViewStyle
  datepicker: ViewStyle
  flatlists: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { width } = Dimensions.get('window')
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    logo: {
      width: 153,
      height: 118,
    },
    datepicker: {
      alignSelf: 'center',
    },
    banner: {
      position: 'relative',
      alignItems: 'center',
      gap: 20,
      paddingBlock: 60,
    },
    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
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
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: '100%',
      alignSelf: 'flex-end',
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
    flatlists: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
    },
  })
}

export default useStyles
