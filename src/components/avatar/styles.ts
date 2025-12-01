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
      overflow: 'hidden',
      height: 40,
      // width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      padding: 8,
    },
    image: {
      width: '100%',
      height: '100%',
    },
  })
}

export default useStyles
