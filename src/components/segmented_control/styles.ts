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
      gap: 4,
      backgroundColor: colors.container.default,
      borderColor: colors.container.stroke,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    divider: {
      width: 2,
      height: 18,
      backgroundColor: colors.container.stroke,
    },
  })
}

export default useStyles
