import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors, fonts } = useTheme()

  return StyleSheet.create({
    root: {
      color: colors.foreground.default,
      fontFamily: fonts.secondary.regular,
      borderColor: colors.container.stroke,
      borderWidth: 1,
      width: '100%',
      padding: 8,
      borderRadius: 12,
      backgroundColor: colors.container.default,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  })
}

export default useStyles
