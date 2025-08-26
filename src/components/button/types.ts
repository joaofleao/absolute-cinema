import { TouchableOpacityProps } from 'react-native'

import { IconProps } from '@components/icon'

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'tertiary'
  title: string
  icon?: React.ReactElement<IconProps>
}
