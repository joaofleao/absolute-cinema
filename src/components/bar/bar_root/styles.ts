import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  divider: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.container.default,
      borderColor: colors.container.stroke,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 22,
    },
    divider: {
      width: 2,
      height: 18,
      backgroundColor: colors.container.stroke,
    },
  })
}

export default useStyles
