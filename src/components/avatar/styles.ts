import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  image: ImageStyle
  iconContainer: ImageStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.container.stroke,
      backgroundColor: colors.container.default,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      overflow: 'hidden',
    },
    iconContainer: {
      padding: 8,
    },
    image: {
      width: 40,
      height: 40,
      // borderRadius: 20,
    },
  })
}

export default useStyles
