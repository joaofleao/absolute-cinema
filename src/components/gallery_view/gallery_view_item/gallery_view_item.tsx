import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import useStyles from './styles'
import { GalleryViewItemProps } from './types'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'

const GalleryViewItem = ({
  posterPath,
  style,
  title,
  ...props
}: GalleryViewItemProps): React.ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={styles.root}
      {...props}
    >
      {posterPath && (
        <Image
          style={styles.image}
          source={{ uri: 'https://image.tmdb.org/t/p/w1280/' + posterPath }}
        />
      )}
      {!posterPath && (
        <Typography
          numberOfLines={6}
          style={styles.title}
          color={theme.semantics.container.foreground.default}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  )
}

export default GalleryViewItem
