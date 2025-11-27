import { Dimensions } from 'react-native'

export const getCoachmarkPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
): {
  top?: number
  left?: number
  right?: number
  bottom?: number
} => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  let top, left, right, bottom

  if (screenHeight - y > screenHeight / 2) top = y + height + 12
  else bottom = screenHeight - y + 12

  if (screenWidth - x > screenWidth / 2) left = x
  else right = screenWidth - x - width

  return { top, left, right, bottom }
}
