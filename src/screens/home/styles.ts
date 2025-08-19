import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  logo: ImageStyle
  title: ViewStyle
  header: ViewStyle
  content: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { colors } = useTheme()

  return StyleSheet.create({
    root: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    logo: {
      width: 153,
      height: 118,
    },
    header: {
      alignItems: 'center',
      gap: 16,
      paddingBlock: 60,
    },
    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}

export default useStyles
