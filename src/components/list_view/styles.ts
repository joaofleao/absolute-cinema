import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  root: ViewStyle
  list: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
      position: 'relative',
    },
    list: {
      gap: 16,
      padding: 16,
      justifyContent: 'space-between',
    },
  })
}

export default useStyles
