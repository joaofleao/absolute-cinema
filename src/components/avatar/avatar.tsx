import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import useStyles from './styles'
import { AvatarProps } from './types'
import { IconPerson } from '@components/icon'

const Avatar = ({ image, ...props }: AvatarProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      style={styles.root}
      {...props}
    >
      {image !== undefined ? (
        <Image
          style={styles.image}
          source={{ uri: image }}
        />
      ) : (
        <View style={styles.iconContainer}>
          <IconPerson />
        </View>
      )}
    </TouchableOpacity>
  )
}

export default Avatar
