import { TouchableOpacityProps } from 'react-native'

import { IconProps } from '@components/icon'

export interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactElement<IconProps>
}
