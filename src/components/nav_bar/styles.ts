import { StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  background: ViewStyle
  container: ViewStyle
  leading: ViewStyle
  trailing: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()
  const { bottom, left, right } = useSafeAreaInsets()
  return StyleSheet.create({
    background: {
      backgroundColor: semantics.container.base.default,
      height: '100%',
      width: '100%',
      flexDirection: 'row',
    },
    container: {
      borderWidth: 1,
      borderColor: semantics.container.stroke.default,
      backgroundColor: semantics.container.base.default,
      borderRadius: 30,
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 10,
      bottom: bottom + 20,
    },
    leading: {
      left: left + 20,
    },
    trailing: {
      right: right + 20,
    },
  })
}

export default useStyles
