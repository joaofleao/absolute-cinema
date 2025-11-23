import { TouchableOpacityProps } from 'react-native'

import { IconProps } from '@components/icon'

export type ListViewItemActionProps = {
  icon?: React.ReactElement<IconProps>
  title: string
  onPress: (movie: NonNullable<ListViewItemProps['_id']>) => void | Promise<void>
  loading: (movie: NonNullable<ListViewItemProps['_id']>) => boolean
}

export interface ListViewItemProps extends TouchableOpacityProps {
  _id?: number
  posterPath?: string | undefined
  title?: string
  voteAverage?: number
  date?: string
  language?: string
  topButton?: ListViewItemActionProps
  bottomButton?: ListViewItemActionProps
}
