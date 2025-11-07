import React from 'react'
import { View } from 'react-native'

import useStyles from './styles'
import { BoxProps } from './types'

const Box = ({
  container = true,
  accent,
  positive,
  negative,
  caution,
  style,
  ...props
}: BoxProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <View
      style={[
        container && styles.container,
        accent && styles.accent,
        positive && styles.positive,
        negative && styles.negative,
        caution && styles.caution,
        style,
      ]}
      {...props}
    />
  )
}

export default Box
