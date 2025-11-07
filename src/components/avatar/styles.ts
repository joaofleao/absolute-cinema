import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  image: ImageStyle
  iconContainer: ImageStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    root: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: semantics.container.stroke.default,
      backgroundColor: semantics.container.base.default,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    iconContainer: {
      padding: 8,
    },
    image: {
      width: 40,
      height: 40,
    },
  })
}

export default useStyles
