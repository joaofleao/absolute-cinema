import { GestureResponderEvent, TouchableOpacityProps } from 'react-native'

import { IconProps } from '@components/icon'

export type ListViewItemActionProps = {
  icon?: React.ReactElement<IconProps>
  title: string
  onPress: (movie: NonNullable<ListViewItemProps['_id']>) => void | Promise<void>
  loading?: (movie: NonNullable<ListViewItemProps['_id']>) => boolean
}

export interface ListViewItemProps extends Omit<TouchableOpacityProps, 'onPress'> {
  _id: string
  posterPath?:
    | {
        pt_BR: string
        en_US: string
      }
    | string

  title:
    | {
        pt_BR: string
        en_US: string
      }
    | string
  voteAverage?: number
  date: string
  language: string
  topButton?: ListViewItemActionProps
  bottomButton?: ListViewItemActionProps
  onPress?: (e: GestureResponderEvent, id?: string) => void
  onLongPress?: (e: GestureResponderEvent, id?: string) => void
}
