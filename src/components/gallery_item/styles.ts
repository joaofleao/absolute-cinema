import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  image: ImageStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    root: {
      position: 'relative',
      borderRadius: 4,
      borderWidth: 1,
      height: 40,
      backgroundColor: semantics.container.base.default,
      borderColor: semantics.container.stroke.default,
      width: (Dimensions.get('screen').width - 32 - 32) / 3,
      aspectRatio: 2 / 3,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  })
}

export default useStyles
