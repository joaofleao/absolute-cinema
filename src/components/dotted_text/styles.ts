import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  ball: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    ball: {
      width: 6,
      height: 6,
      backgroundColor: colors.foreground.light,
      borderRadius: '100%',
    },
  })
}

export default useStyles
