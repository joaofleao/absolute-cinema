import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import useStyles from './styles'
import { ListItemProps } from './types'
import Typography from '@components/typography'

const ListItem = ({ title, date, image, style, ...props }: ListItemProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      style={[styles.root, style]}
      {...props}
    >
      <Image
        style={[styles.image]}
        source={{ uri: 'https://image.tmdb.org/t/p/w1280/' + image }}
      />
      <View style={[styles.content]}>
        <Typography description>{date}</Typography>
        <Typography title>{title}</Typography>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
