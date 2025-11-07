import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  content: ViewStyle
  image: ImageStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    root: {
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: semantics.container.base.default,
      borderColor: semantics.container.stroke.default,
      flexDirection: 'row',

      gap: 16,
    },
    content: {
      height: '100%',
      flex: 1,
    },
    image: {
      borderRadius: 4,
      aspectRatio: 2 / 3,
      width: 60,
    },
  })
}

export default useStyles
