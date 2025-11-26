import { GestureResponderEvent, TouchableOpacityProps } from 'react-native'

export interface GalleryViewItemProps extends Omit<TouchableOpacityProps, 'onPress'> {
  _id: number
  posterPath?: string | undefined
  title?: string
  date?: string
  voteAverage?: number
  onPress?: (e: GestureResponderEvent, id?: string) => void
}
