import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  container: ViewStyle
  header: ViewStyle
  content: ViewStyle
  footer: ViewStyle

  passwordWithForget: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      backgroundColor: semantics.background.base.default,
    },
    container: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right + 16,
      paddingLeft: left + 16,
    },

    header: {
      justifyContent: 'center',
      // flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },

    content: {
      gap: 20,
    },

    footer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },

    passwordWithForget: {
      alignItems: 'center',
      gap: 8,
    },
  })
}

export default useStyles
