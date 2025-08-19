import { StyleSheet, TextStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  display: TextStyle
  header: TextStyle
  description: TextStyle
  section: TextStyle
  primary: TextStyle
  secondary: TextStyle
  title: TextStyle
  light: TextStyle
}

const useStyles = (): StylesReturn => {
  const { colors, fonts } = useTheme()

  return StyleSheet.create({
    display: {
      color: colors.foreground.default,
      fontFamily: fonts.primary.regular,
      fontSize: 64,
      lineHeight: 88,
      letterSpacing: 1,
    },
    header: {
      color: colors.foreground.default,
      fontFamily: fonts.tertiary.bold,
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 1,
    },
    description: {
      color: colors.foreground.default,
      fontFamily: fonts.secondary.bold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 1,
    },
    section: {
      color: colors.foreground.default,
      fontFamily: fonts.secondary.bold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 2,
    },
    primary: {
      color: colors.foreground.default,
      fontFamily: fonts.secondary.regular,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 2,
    },
    secondary: {
      color: colors.foreground.default,
      fontFamily: fonts.secondary.regular,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 2,
    },
    title: {
      color: colors.foreground.default,
      fontFamily: fonts.tertiary.bold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    light: {
      color: colors.foreground.light,
    },
  })
}

export default useStyles
