import React from 'react'
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native'

import useStyle from './styles'
import { ListViewItemProps } from './types'
import { IconProps } from '@components/icon'
import Rating from '@components/rating'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'

const ListViewItem = ({
  _id,
  title,
  date,
  posterPath,
  voteAverage,
  language,
  topButton,
  bottomButton,
  onLongPress,
  onPress,
  ...props
}: ListViewItemProps): React.ReactElement => {
  const style = useStyle()
  const theme = useTheme()

  const renderButton = (
    button: typeof topButton,
    position: 'top' | 'bottom',
  ): React.ReactElement | undefined => {
    if (!button) return
    const isLoading = button.loading?.(_id) ?? false

    return (
      <TouchableOpacity
        delayLongPress={3000}
        activeOpacity={0.7}
        style={[style.button, position === 'top' ? style.top : style.bottom]}
        onPress={() => button.onPress(_id)}
        disabled={isLoading}
      >
        <View style={[style.buttonContent, isLoading && style.hide]}>
          <Typography color={theme.semantics.container.foreground.default}>
            {button.title}
          </Typography>

          {button.icon &&
            React.cloneElement<IconProps>(button.icon, {
              color: theme.semantics.container.foreground.default,
              size: 16,
            })}
        </View>

        <View style={[style.loading, !isLoading && style.hide]}>
          <ActivityIndicator color={theme.semantics.container.foreground.default} />
        </View>
      </TouchableOpacity>
    )
  }

  const content = (
    <>
      {posterPath !== undefined ? (
        <Image
          style={style.image}
          source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
          alt={title}
        />
      ) : (
        <View style={style.imagePlaceholder} />
      )}

      <View style={{ flex: 1, gap: 4 }}>
        <Typography body>{title}</Typography>
        <Rating value={voteAverage} />
        <Typography legend>{`${date} ${language}`}</Typography>
      </View>
    </>
  )

  return (
    <View style={{ flexDirection: 'row' }}>
      {(onPress || onLongPress) && (
        <TouchableOpacity
          onPress={(e) => onPress?.(e, props.id)}
          onLongPress={(e) => onLongPress?.(e, props.id)}
          style={[style.root, topButton && bottomButton && style.hasButtons]}
          activeOpacity={0.7}
          {...props}
        >
          {content}
        </TouchableOpacity>
      )}

      {!onPress && !onLongPress && (
        <View
          style={[style.root, topButton && bottomButton && style.hasButtons]}
          activeOpacity={0.7}
          {...props}
        >
          {content}
        </View>
      )}

      {topButton && bottomButton && (
        <View>
          {renderButton(topButton, 'top')}
          {renderButton(bottomButton, 'bottom')}
        </View>
      )}
    </View>
  )
}

export default ListViewItem
