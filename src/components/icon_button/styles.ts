import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.container.stroke,
      backgroundColor: colors.container.default,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  })
}

export default useStyles
