import { useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, View } from 'react-native'
import { useKeyboardHandler } from 'react-native-keyboard-controller'
import RadialGradient from 'react-native-radial-gradient'
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAction, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Button from '@components/button'
import DottedText from '@components/dotted_text'
import { IconAddCircle, IconCheckCircle } from '@components/icon'
import SearchInput from '@components/search_input'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { ScreenType } from '@router'

const useGradualAnimation = (): { height: SharedValue<number> } => {
  const height = useSharedValue(0)

  const { bottom } = useSafeAreaInsets()

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet'
        height.value = Math.max(event.height - bottom, 0)
      },
    },
    [],
  )
  return { height }
}

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path?: string
  backdrop_path?: string
  release_date: string
  vote_average: number
  genre_ids: number[]
}

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

const Search: ScreenType<'search'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t } = useTranslation()
  const theme = useTheme()

  const { height } = useGradualAnimation()
  const keyboardView = useAnimatedStyle(() => {
    return { height: Math.abs(height.value) }
  }, [])

  const [results, setResults] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)

  const searchMovies = useAction(api.movies.searchMovies)
  const getOrCreateMovie = useMutation(api.movies.getOrCreateMovie)
  const markAsWatched = useMutation(api.movies.markAsWatched)
  const addToWatchlist = useMutation(api.movies.addToWatchlist)

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const searchResults = await searchMovies({ query: query.trim() })
      setResults(searchResults)
    } catch {
      Alert.alert('Failed to search movies. Please check your TMDB API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (movie: TMDBMovie): Promise<void> => {
    try {
      const genres = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean)

      const movieId = await getOrCreateMovie({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        genres,
      })

      if (movieId)
        await addToWatchlist({ movieId }).then(() => {
          Alert.alert(`Added "${movie.title}" to your watchlist`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to add movie to watchlist')
    }
  }

  const handleWatch = async (movie: TMDBMovie): Promise<void> => {
    try {
      const genres = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean)

      const movieId = await getOrCreateMovie({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        genres,
      })

      if (movieId)
        await markAsWatched({ movieId }).then(() => {
          Alert.alert(`Marked "${movie.title}" as watched`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to mark movie as watched')
    }
  }

  const { width } = Dimensions.get('window')

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.root}>
        <View>
          <View style={styles.header}>
            <View style={styles.title}>
              <View style={styles.gradientContainer}>
                <RadialGradient
                  style={styles.gradient}
                  colors={[
                    theme.primitives.vibrant.ruby[15],
                    theme.semantics.background.base.default,
                  ]}
                  radius={300}
                  center={[width / 2, width]}
                />
              </View>
              <Typography title>ABSOLUTE CINEMA</Typography>
            </View>
          </View>

          <View style={styles.content}>
            {results.length > 0 &&
              results.map((movie) => (
                <View
                  key={movie.id}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.semantics.container.stroke.default,
                    backgroundColor: theme.semantics.container.base.default,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                  }}
                >
                  {movie.poster_path ? (
                    <Image
                      style={{ width: 100, aspectRatio: 27 / 40, borderRadius: 8 }}
                      source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                      alt={movie.title}
                    />
                  ) : (
                    <View style={{ width: 100, aspectRatio: 9 / 16, borderRadius: 4 }} />
                  )}

                  <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <Typography color="container">{movie.title}</Typography>
                    <Typography color="container">
                      {new Date(movie.release_date).getFullYear()} • ⭐{' '}
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button
                        onPress={() => handleSave(movie)}
                        title={t('search:save')}
                        icon={<IconAddCircle />}
                      />
                      <Button
                        onPress={() => handleWatch(movie)}
                        title={t('search:watch')}
                        icon={<IconCheckCircle />}
                      />
                    </View>
                  </View>
                </View>
              ))}

            {loading && <ActivityIndicator />}

            {results.length === 0 && !loading && (
              <View style={{ paddingVertical: 200 }}>
                <DottedText>{t('search:empty_state')}</DottedText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <SearchInput
          debounce={2000}
          onChangeText={handleSearch}
        />
      </View>
      <Animated.View style={keyboardView} />
    </View>
  )
}

export default Search
