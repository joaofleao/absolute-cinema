import { TextStyle, ViewStyle } from 'react-native'

import { CoachmarkProps } from './types'
import { useTheme } from '@providers/theme'

type StylesProps = {
  visible: CoachmarkProps['visible']
}

type StylesReturn = {
  root: ViewStyle
  title: TextStyle
  description: TextStyle
  footer: ViewStyle
  arrow: ViewStyle
  backdrop: ViewStyle
}

const useStyles = (props: StylesProps): StylesReturn => {
  const { semantics, fonts, layer } = useTheme()

  return {
    arrow: {
      backgroundColor: semantics.container.base.default,
      width: 20,
      height: 20,
      position: 'absolute',
      right: 4,
      transform: [{ rotate: '45deg' }],
      top: -10,
    },
    root: {
      position: 'absolute',
      maxWidth: '50%',
      backgroundColor: semantics.container.base.default,
      borderColor: semantics.container.stroke.default,
      borderWidth: 1,
      borderRadius: 16,
      gap: 10,
      padding: 20,
      display: props.visible ? 'flex' : 'none',
      zIndex: props.visible ? layer.overlay : undefined,
    },
    title: {
      color: semantics.container.foreground.default,
      fontFamily: fonts.secondary.bold,
      fontSize: 20,
    },
    description: {
      fontFamily: fonts.secondary.regular,
      color: semantics.container.foreground.light,
      fontSize: 16,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      opacity: props.visible ? 0.5 : 0,
      zIndex: props.visible ? layer.overlay : undefined,
    },
  }
}

export default useStyles
