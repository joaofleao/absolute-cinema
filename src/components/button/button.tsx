import React from 'react'
import { TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { ButtonProps } from './types'
import { IconProps } from '@components/icon/types'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'

const Button = ({
  variant = 'secondary',
  title,
  icon,
  style,
  ...props
}: ButtonProps): React.ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.root,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'tertiary' && styles.tertiary,
        style,
      ]}
      {...props}
    >
      <Typography
        inverse={variant === 'primary'}
        custom
      >
        {title}
      </Typography>

      {icon &&
        React.cloneElement<IconProps>(icon, {
          color:
            variant === 'primary'
              ? theme.colors.foreground.inverse
              : theme.colors.foreground.default,
          size: 16,
        })}
    </TouchableOpacity>
  )
}

export default Button
