import { StyleSheet, ViewStyle } from 'react-native'

type StylesReturn = {
  root: ViewStyle
  filled: ViewStyle
  unfilled: ViewStyle
}
type StylesProps = {
  value: number
}

const useStyles = ({ value }: StylesProps): StylesReturn => {
  return StyleSheet.create({
    root: {
      width: 100,
      position: 'relative',
    },
    filled: {
      flexDirection: 'row',
      width: `${value * 10}%`,
      overflow: 'hidden',
      position: 'absolute',
    },
    unfilled: {
      flexDirection: 'row',
    },
  })
}

export default useStyles
