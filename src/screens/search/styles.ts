import { Dimensions, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  safeArea: ViewStyle
  root: ViewStyle
  title: ViewStyle
  header: ViewStyle
  content: ViewStyle
  footer: ViewStyle
  gradientContainer: ViewStyle
  gradient: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  const { top, bottom, right, left } = useSafeAreaInsets()
  const { width } = Dimensions.get('window')

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.default,
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
    },
    gradientContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: -width / 3,
    },
    gradient: {
      height: width * 2,
      width: width,
    },
    root: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      gap: 20,
      paddingBlock: 20,
    },
    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 12,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
  })
}

export default useStyles
