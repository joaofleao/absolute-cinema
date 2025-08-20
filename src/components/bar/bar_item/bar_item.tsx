import React from 'react'
import { View } from 'react-native'

import useStyles from './styles'
import { BarProps } from './types'
import Typography from '@components/typography'

const Bar = ({ children, icon }: BarProps): React.ReactElement => {
  const style = useStyles()

  return (
    <View style={style.root}>
      <Typography custom>{children}</Typography>
      {icon && <View style={style.icon}>{icon}</View>}
    </View>
  )
}

export default Bar
