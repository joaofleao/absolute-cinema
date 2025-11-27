import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StylesReturn = {
  content: ViewStyle
  datepicker: ViewStyle
  list: ViewStyle
  calendarFooter: ViewStyle
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
    calendarFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  })
}

export default useStyles
