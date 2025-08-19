import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  logo: ImageStyle
  title: ViewStyle
  header: ViewStyle
  content: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
      backgroundColor: colors.background.default,
      flex: 1,
    },
    logo: {
      width: 153,
      height: 118,
    },
    header: {
      alignItems: 'center',
      gap: 16,
      paddingBlock: 60,
    },
    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}

export default useStyles
