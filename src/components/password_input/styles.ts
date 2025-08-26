import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  leading: ViewStyle
  trailing: ViewStyle
  input: TextStyle
  container: TextStyle
  rule: TextStyle
  valid: TextStyle
}

const useStyles = (): StylesReturn => {
  const { colors, fonts } = useTheme()

  return StyleSheet.create({
    root: {
      borderColor: colors.container.stroke,
      borderWidth: 1,
      width: '100%',
      borderRadius: 12,
      backgroundColor: colors.container.default,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leading: {
      position: 'absolute',
      left: 8,
    },
    trailing: {
      position: 'absolute',
      right: 8,
      padding: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.container.stroke,
      backgroundColor: colors.container.default,
      alignItems: 'center',
    },
    input: {
      height: 40,
      letterSpacing: 1,
      color: colors.foreground.default,
      fontFamily: fonts.secondary.regular,
      padding: 8,
      paddingRight: 8 + 24 + 4,
      paddingLeft: 8 + 24 + 4,
      fontSize: 14,
      flex: 1,
    },

    rule: {
      // flex: 1,
      // color: colors.text.light,
      // fontFamily: fonts.secondary.bold,
      // fontSize: 12,
      // lineHeight: 18,
    },
    valid: {
      // color: colors.positive.default,
    },
    container: {
      flexDirection: 'row',
      // alignItems: 'center',
      gap: 8,
    },
  })
}

export default useStyles
