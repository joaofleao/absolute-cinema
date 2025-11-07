import React from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

import useStyles from './styles'
import { ButtonProps } from './types'
import { IconProps } from '@components/icon/types'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'

const Button = ({
  variant = 'container',
  title,
  icon,
  style,
  loading = false,
  ...props
}: ButtonProps): React.ReactElement => {
  const styles = useStyles({ variant })
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[styles.root, style]}
      {...props}
    >
      <View style={[styles.content, loading && styles.hide]}>
        <Typography color={variant}>{title}</Typography>

        {icon &&
          React.cloneElement<IconProps>(icon, {
            color: theme.semantics[variant].foreground.default,
            size: 16,
          })}
      </View>

      <View style={[styles.loading, !loading && styles.hide]}>
        <ActivityIndicator color={theme.semantics[variant].foreground.default} />
      </View>
    </TouchableOpacity>
  )
}

export default Button
