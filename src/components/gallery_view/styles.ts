import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  root: ViewStyle
  list: ViewStyle
  gallery: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,

      flex: 1,
      position: 'relative',
    },
    list: {
      gap: 16,
      padding: 16,
    },
    gallery: {
      justifyContent: 'space-between',
    },
  })
}

export default useStyles
