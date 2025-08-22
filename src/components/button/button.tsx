import React from 'react'
import { TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { ButtonProps } from './types'
import { IconProps } from '@components/icon/types'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'

const Button = ({ title, icon, ...props }: ButtonProps): React.ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={styles.root}
      {...props}
    >
      <Typography custom>{title}</Typography>

      {icon &&
        React.cloneElement<IconProps>(icon, {
          color: theme.colors.foreground.default,
          size: 16,
        })}
    </TouchableOpacity>
  )
}

export default Button
