import React from 'react'
import { TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { IconButtonProps } from './types'
import { IconProps } from '@components/icon/types'
import { useTheme } from '@providers/theme'

const IconButton = ({ icon, ...props }: IconButtonProps): React.ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={styles.root}
      {...props}
    >
      {React.cloneElement<IconProps>(icon, {
        color: theme.colors.foreground.default,
      })}
    </TouchableOpacity>
  )
}

export default IconButton
