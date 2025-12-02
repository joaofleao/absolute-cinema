import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  hide: ViewStyle

  header: ViewStyle
  footer: ViewStyle
  content: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right + 40,
      paddingLeft: left + 40,
      backgroundColor: semantics.background.base.default,
      flex: 1,
      position: 'relative',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },

    content: {
      width: '100%',
    },
    hide: {
      opacity: 0,
    },
    header: {
      gap: 16,
      flexDirection: 'row',
    },
    footer: {
      gap: 16,
      flexDirection: 'row',
      paddingBottom: 40,
    },
  })
}

export default useStyles
