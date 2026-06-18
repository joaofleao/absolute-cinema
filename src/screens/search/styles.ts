import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  container: ViewStyle
  content: ViewStyle
  input: ViewStyle
  datepicker: ViewStyle
  calendarFooter: ViewStyle
  footer: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { top, bottom, right, left } = useSafeAreaInsets()
  const { semantics } = useTheme()
  return StyleSheet.create({
    datepicker: {
      alignSelf: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      paddingTop: 10,
    },
    root: {
      backgroundColor: semantics.background.base.default,
    },
    container: {
      backgroundColor: 'red',
      paddingTop: top,
      paddingBottom: bottom,
      gap: 12,
    },
    input: {
      flex: 1,
    },
    footer: {
      flexDirection: 'row',
      gap: 8,
    },
    calendarFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  })
}

export default useStyles
