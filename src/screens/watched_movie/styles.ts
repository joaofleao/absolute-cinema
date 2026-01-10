import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@providers/theme'

type StylesReturn = {
  root: ViewStyle
  logo: ImageStyle
  title: ViewStyle
  header: ViewStyle
  content: ViewStyle
  gradient: ViewStyle
  gradientContainer: ViewStyle
  footer: ViewStyle
  head: ViewStyle
  image: ImageStyle
  imagePlaceholder: ViewStyle
}

const useStyles = (): StylesReturn => {
  const { semantics } = useTheme()
  const { width } = Dimensions.get('window')
  const { top, bottom, right, left } = useSafeAreaInsets()

  return StyleSheet.create({
    root: {
      paddingTop: top,
      paddingBottom: bottom,
      paddingRight: right,
      paddingLeft: left,
      backgroundColor: semantics.background.base.default,
      flex: 1,
      position: 'relative',
    },
    logo: {
      width: 153,
      height: 118,
    },
    header: {
      position: 'relative',
      alignItems: 'center',
      gap: 20,
    },
    title: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
    },
    gradientContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: -width / 2,
    },
    gradient: {
      height: width * 2,
      width: width,
    },
    footer: {
      position: 'absolute',
      bottom,
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: '100%',
      alignSelf: 'flex-end',
    },
    head: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      position: 'absolute',
      top,
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: '100%',
      alignSelf: 'flex-end',
    },
    image: {
      width: 120,
      aspectRatio: 2 / 3,
      backgroundColor: semantics.container.base.default,
      borderWidth: 1,
      borderColor: semantics.container.stroke.default,
    },
    imagePlaceholder: {
      width: 120,
      aspectRatio: 2 / 3,
      borderRadius: 4,
    },
  })
}

export default useStyles
