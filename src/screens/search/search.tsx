import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ActivityIndicator, Alert, View } from 'react-native'
import { useKeyboardHandler } from 'react-native-keyboard-controller'
import { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useAction, useConvexAuth, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Button from '@components/button'
import DottedText from '@components/dotted_text'
import Dropdown from '@components/dropdown'
import ListView, { ListViewItemProps } from '@components/list_view'
import { ListViewItemActionProps } from '@components/list_view/list_view_item'
import SearchInput from '@components/search_input'
import { TinyCheckmark, TinyPlus } from '@components/tiny_icon'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { ScreenType } from '@router'
import { LanguageCode, languages } from '@utils/languages'

const useGradualAnimation = (): { height: SharedValue<number> } => {
  const height = useSharedValue(0)

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet'
        height.value = event.height
      },
      onEnd: (event) => {
        'worklet'
        height.value = event.height
      },
    },
    [],
  )
  return { height }
}

interface TMDBMovie {
  id: number
  title: string
  poster_path?: string
  release_date: string
  vote_average: number
  original_language: string
}

const Search: ScreenType<'search'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { isAuthenticated } = useConvexAuth()

  const { height } = useGradualAnimation()

  const [calendarDropdown, setCalendarDropdown] = useState(false)
  const [date, setDate] = useState<Date>(new Date(Date.now()))
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState<number>()
  const [selectedMovie, setSelectedMovie] = useState<number>()

  const refinedResults: ListViewItemProps[] = results.map((movie) => ({
    _id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    date:
      movie.release_date === ''
        ? t('search:unrelesed')
        : new Date(movie.release_date).getFullYear().toString(),
    voteAverage: movie.vote_average,
    language:
      languages[movie.original_language as LanguageCode][i18n.language as 'en-US' | 'pt-BR'],
  }))

  const searchMovies = useAction(api.movies.searchMovies)
  const getOrCreateMovie = useMutation(api.movies.getOrCreateMovie)
  const markAsWatched = useMutation(api.movies.markAsWatched)
  const addToWatchlist = useMutation(api.movies.addToWatchlist)

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return
    try {
      const searchResults: TMDBMovie[] = await searchMovies({
        query: query.trim(),
        language: i18n.language,
      })

      setResults(searchResults)
    } catch {
      Alert.alert('Failed to search movies. Please check your TMDB API key.')
    } finally {
      setLoading(false)
    }
  }

  const isSaveLoading: ListViewItemActionProps['loading'] = (movie): boolean => {
    return movie === saveLoading
  }

  const handleSave: ListViewItemActionProps['onPress'] = async (movie) => {
    if (!isAuthenticated) navigation.navigate('auth')
    setSaveLoading(movie)
    try {
      const tmdbMovie = results.find((original) => {
        return original.id === movie
      })!

      const movieId = await getOrCreateMovie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: tmdbMovie.release_date,
        voteAverage: tmdbMovie.vote_average,
        originalLanguage: tmdbMovie.original_language,
        ...(tmdbMovie.poster_path && { posterPath: tmdbMovie.poster_path }),
      })

      if (movieId)
        await addToWatchlist({ movieId }).then(() => {
          Alert.alert(`"${tmdbMovie.title}" added to your watchlist`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to add movie to watchlist')
    } finally {
      setSaveLoading(undefined)
    }
  }

  const handleWatch: ListViewItemActionProps['onPress'] = async (movie) => {
    if (!isAuthenticated) navigation.navigate('auth')
    else setSelectedMovie(movie)
    setCalendarDropdown(true)
  }

  const watchMovie = async (): Promise<void> => {
    try {
      const tmdbMovie = results.find((original) => {
        return original.id === selectedMovie
      })!

      const movieId = await getOrCreateMovie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: tmdbMovie.release_date,
        voteAverage: tmdbMovie.vote_average,
        originalLanguage: tmdbMovie.original_language,
        ...(tmdbMovie.poster_path && { posterPath: tmdbMovie.poster_path }),
      })

      if (movieId)
        await markAsWatched({ movieId, watchedAt: date.getTime() }).then(() => {
          Alert.alert(`"${tmdbMovie.title}" marked as watched`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to mark movie as watched')
    } finally {
      setSelectedMovie(undefined)
      setCalendarDropdown(false)
    }
  }

  const header = (
    <SearchInput
      debounce={2000}
      onChangeText={() => setLoading(true)}
      onDebouncedText={handleSearch}
      onClear={() => {
        setResults([])
        setLoading(false)
      }}
    />
  )

  const emptyState = (
    <View style={styles.content}>
      {loading ? <ActivityIndicator /> : <DottedText>{t('search:empty_state')}</DottedText>}
    </View>
  )

  return (
    <>
      <ListView
        style={styles.list}
        data={refinedResults}
        header={header}
        empty={emptyState}
        topButton={{
          title: t('search:watch'),
          icon: <TinyCheckmark />,
          onPress: handleWatch,
        }}
        bottomButton={{
          title: t('search:save'),
          icon: <TinyPlus />,
          loading: isSaveLoading,
          onPress: handleSave,
        }}
      />

      <Dropdown
        visible={calendarDropdown}
        setVisible={setCalendarDropdown}
      >
        <DateTimePicker
          maximumDate={new Date(Date.now())}
          style={styles.datepicker}
          themeVariant="dark"
          display="inline"
          value={date}
          onChange={(_, date) => {
            if (date) setDate(date)
          }}
          accentColor={theme.primitives.vibrant.ruby[40]}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            title="cancel"
            onPress={() => setCalendarDropdown(false)}
          />
          <Button
            title="submit"
            variant="accent"
            onPress={watchMovie}
          />
        </View>
      </Dropdown>
    </>
  )
}

export default Search
