import React from 'react'
import { View } from 'react-native'

import useStyles from './styles'
import { RatingProps } from './types'
import { IconStar } from '@components/icon'
import { useTheme } from '@providers/theme'

const Rating = ({ value = 0, total = 10 }: RatingProps): React.ReactElement => {
  const style = useStyles({ value })
  const theme = useTheme()

  const unfilled = (
    <View style={style.unfilled}>
      {Array.from({ length: total }, (_, index) => (
        <IconStar
          size={10}
          key={index}
          color={theme.primitives.vibrant.tangerine[10]}
        />
      ))}
    </View>
  )

  const filled = (
    <View style={style.filled}>
      {Array.from({ length: total }, (_, index) => (
        <IconStar
          size={10}
          key={index}
          color={theme.primitives.vibrant.tangerine[60]}
        />
      ))}
    </View>
  )

  return (
    <View style={style.root}>
      {unfilled}
      {filled}
    </View>
  )
}

export default Rating
