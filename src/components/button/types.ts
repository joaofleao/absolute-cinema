import { TouchableOpacityProps } from 'react-native'

import { BoxKeys } from '@components/box'
import { IconProps } from '@components/icon'

export interface ButtonProps extends TouchableOpacityProps {
  title: string
  icon?: React.ReactElement<IconProps>
  loading?: boolean
  variant?: BoxKeys
}
