import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  icon: ViewStyle
  input: TextStyle
}

const useStyles = (): StylesReturn => {
  const { semantics, fonts } = useTheme()

  return StyleSheet.create({
    root: {
      borderColor: semantics.container.stroke.default,
      borderWidth: 1,
      width: '100%',
      borderRadius: 12,
      backgroundColor: semantics.container.base.default,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute',
      right: 8,
      pointerEvents: 'box-none',
    },
    input: {
      height: 40,
      letterSpacing: 1,
      color: semantics.container.foreground.default,
      fontFamily: fonts.secondary.regular,
      padding: 8,
      paddingRight: 8 + 24 + 4,
      paddingLeft: 12,
      fontSize: 14,
      flex: 1,
    },
  })
}

export default useStyles
