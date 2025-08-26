import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  content: ViewStyle
  primary: ViewStyle
  secondary: ViewStyle
  tertiary: ViewStyle
  loading: ViewStyle
  hide: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      position: 'relative',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,

      height: 40,
    },
    primary: {
      backgroundColor: '#E6E7E6',
      borderColor: '#E6E7E6',
    },
    secondary: {
      backgroundColor: colors.container.default,
      borderColor: colors.container.stroke,
    },
    tertiary: {
      borderWidth: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
      height: 'auto',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loading: {
      opacity: 1,
      position: 'absolute',
      height: 40,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    hide: {
      opacity: 0,
    },
  })
}

export default useStyles
