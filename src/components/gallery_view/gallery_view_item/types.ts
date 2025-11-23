import { TouchableOpacityProps } from 'react-native'
import { Id } from 'convex/_generated/dataModel'

export interface GalleryViewItemProps extends TouchableOpacityProps {
  _id?: Id<'movies'> | undefined | number
  posterPath?: string | undefined
  title?: string
  date?: string
  voteAverage?: number
}
