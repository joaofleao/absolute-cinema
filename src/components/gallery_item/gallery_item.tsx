import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { GalleryItemProps } from './types'

const GalleryItem = ({ image, style, ...props }: GalleryItemProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      style={styles.root}
      {...props}
    >
      <Image
        style={styles.image}
        source={{ uri: 'https://image.tmdb.org/t/p/w1280/' + image }}
      />
    </TouchableOpacity>
  )
}

export default GalleryItem
