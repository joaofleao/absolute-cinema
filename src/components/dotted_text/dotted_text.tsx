import React from 'react'
import { View } from 'react-native'

import useStyles from './styles'
import { DottedTextProps } from './types'
import Typography from '@components/typography'

const DottedText = ({ children }: DottedTextProps): React.ReactElement => {
  const style = useStyles()

  return (
    <View style={style.root}>
      {children.split(' ').map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <View style={style.ball} />}
          <Typography title>{item}</Typography>
        </React.Fragment>
      ))}
    </View>
  )
}

export default DottedText
