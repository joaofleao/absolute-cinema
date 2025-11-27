import React from 'react'
import { View } from 'react-native'

import useStyles from './styles'
import { BarRootProps } from './types'

const Bar = ({ children: childrenProp }: BarRootProps): React.ReactElement => {
  const style = useStyles()

  const children = React.Children.toArray(childrenProp)

  return (
    <View style={style.root}>
      {children.map((child, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <View style={style.divider} />}
          {child}
        </React.Fragment>
      ))}
    </View>
  )
}

export default Bar
