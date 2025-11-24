import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  content: ViewStyle
  datepicker: ViewStyle
  list: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { bottom } = useSafeAreaInsets()
  return StyleSheet.create({
    datepicker: {
      alignSelf: 'center',
    },
    content: {
      alignItems: 'center',
      minHeight: 200,
      justifyContent: 'center',
    },
    list: {
      paddingBottom: bottom,
    },
  })
}

export default useStyles
