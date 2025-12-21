import { StyleSheet, ViewStyle } from 'react-native'

type StylesReturn = {
  root: ViewStyle
  list: ViewStyle
  gallery: ViewStyle
}

const useStyles = (): StylesReturn => {
  return StyleSheet.create({
    root: {
      flex: 1,
      position: 'relative',
    },

    list: {
      gap: 8,
      padding: 16,
    },
    gallery: {
      justifyContent: 'space-between',
    },
  })
}

export default useStyles
