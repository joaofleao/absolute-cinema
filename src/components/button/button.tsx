import React from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

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
  loading = false,
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
      <View style={[styles.content, loading && styles.hide]}>
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
      </View>

      <View style={[styles.loading, !loading && styles.hide]}>
        <ActivityIndicator
          color={
            variant === 'primary'
              ? theme.colors.foreground.inverse
              : theme.colors.foreground.default
          }
        />
      </View>
    </TouchableOpacity>
  )
}

export default Button
