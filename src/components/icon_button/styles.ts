import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    root: {
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      height: 40,
      width: 40,

      borderColor: semantics.container.stroke.default,
      backgroundColor: semantics.container.base.default,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  })
}

export default useStyles
