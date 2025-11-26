import { StyleSheet, ViewStyle } from 'react-native'

import { ButtonProps } from './types'
import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  content: ViewStyle
  loading: ViewStyle
  hide: ViewStyle
}
type StylesProps = {
  variant: Required<ButtonProps>['variant']
}

const useStyles = ({ variant }: StylesProps): StylesReturn => {
  const { semantics } = useTheme()

  return StyleSheet.create({
    root: {
      position: 'relative',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      height: 40,
      backgroundColor: semantics[variant].base.default,
      borderColor: semantics[variant].stroke.default,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loading: {
      opacity: 1,
      position: 'absolute',
      height: 40,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    hide: {
      opacity: 0,
    },
  })
}

export default useStyles
