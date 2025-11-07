import { TouchableOpacityProps } from 'react-native'

export interface ListItemProps extends TouchableOpacityProps {
  title?: string
  date?: string
  image?: string
}
