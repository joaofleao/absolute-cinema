import { Image, ScrollView, View } from 'react-native'
import { useMutation } from 'convex/react'
import { api } from 'convex_api'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import Typography from '@components/typography'
import { ScreenType } from '@router/types'

const WatchedMovie: ScreenType<'watched_movie'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { watchId, posterPath, title, watchedAt } = route.params.movie
  const { t } = useTranslation()
  const removeFromWatchedMovies = useMutation(api.movies.removeFromWatchedMovies)

  return (
    <ScrollView style={styles.root}>
      <View style={styles.header}>
        {posterPath !== undefined ? (
          <Image
            style={styles.image}
            source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
            alt={title}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <Typography>{title}</Typography>
        <Typography body>
          {t('watched_movie:watched_at') + ': ' + new Date(watchedAt).toLocaleDateString()}
        </Typography>
        <Button
          variant="negative"
          title={t('watched_movie:delete')}
          onPress={() => {
            removeFromWatchedMovies({ watchId })
            navigation.goBack()
          }}
        />
      </View>
    </ScrollView>
  )
}

export default WatchedMovie
