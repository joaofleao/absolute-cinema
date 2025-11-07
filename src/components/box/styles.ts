import { StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  container: ViewStyle
  accent: ViewStyle
  positive: ViewStyle
  negative: ViewStyle
  caution: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    container: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: semantics.container.stroke.default,
      backgroundColor: semantics.container.base.default,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    accent: {},
    positive: {},
    negative: {},
    caution: {},
  })
}

export default useStyles
