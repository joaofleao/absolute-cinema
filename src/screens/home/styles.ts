import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  logo: ImageStyle
  title: ViewStyle
  header: ViewStyle
  content: ViewStyle
  gradient: ViewStyle
  gradientContainer: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()
  const { width } = Dimensions.get('window')
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
      backgroundColor: colors.background.default,
      flex: 1,
      position: 'relative',
    },
    logo: {
      width: 153,
      height: 118,
    },
    header: {
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
  })
}

export default useStyles
