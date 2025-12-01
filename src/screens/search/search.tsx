import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ActivityIndicator, Alert, View } from 'react-native'
import { useAction, useConvexAuth, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'
import useConvexErrorHandler from 'src/hooks/useConvexErrorHandler'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Button from '@components/button'
import DottedText from '@components/dotted_text'
import Dropdown from '@components/dropdown'
import { IconX } from '@components/icon'
import IconButton from '@components/icon_button'
import ListView, { ListViewItemProps } from '@components/list_view'
import { ListViewItemActionProps } from '@components/list_view/list_view_item'
import SearchInput from '@components/search_input'
import { TinyCheckmark, TinyPlus } from '@components/tiny_icon'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { ScreenType } from '@router'
import { LanguageCode, languages } from '@utils/languages'

const Search: ScreenType<'search'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { isAuthenticated } = useConvexAuth()
  const catchConvexError = useConvexErrorHandler()

  const searchMovies = useAction(api.movies.searchMovies)
  const getOrCreateMovie = useMutation(api.movies.getOrCreateMovie)
  const markAsWatched = useMutation(api.movies.markAsWatched)
  const addToWatchlist = useMutation(api.movies.addToWatchlist)

  const [results, setResults] = useState<Awaited<ReturnType<typeof searchMovies>>>()

  const [calendarDropdown, setCalendarDropdown] = useState(false)
  const [date, setDate] = useState<Date>(new Date(Date.now()))
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState<number>()
  const [selectedMovie, setSelectedMovie] = useState<number>()

  const refinedResults: ListViewItemProps[] = (results ?? []).map((movie) => ({
    _id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    date:
      movie.release_date === ''
        ? t('search:unrelesed')
        : new Date(movie.release_date).getFullYear().toString(),
    voteAverage: movie.vote_average,
    language: languages[movie.original_language as LanguageCode][i18n.language],
  }))

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return
    try {
      const searchResults = await searchMovies({
        query: query.trim(),
      })

      setResults(searchResults)
    } catch {
      Alert.alert(t('overall:tmdb_error'))
    } finally {
      setLoading(false)
    }
  }

  const isSaveLoading: ListViewItemActionProps['loading'] = (movie): boolean => {
    return movie === saveLoading
  }

  const handleSave: ListViewItemActionProps['onPress'] = async (movie) => {
    if (!isAuthenticated) navigation.navigate('auth')
    if (!results) return
    setSaveLoading(movie)
    try {
      const tmdbMovie = results.find((original) => original.id === movie)
      if (!tmdbMovie) throw Error

      const movieId = await getOrCreateMovie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: tmdbMovie.release_date,
        voteAverage: tmdbMovie.vote_average,
        originalLanguage: tmdbMovie.original_language,
        posterPath: tmdbMovie.poster_path,
      })

      if (movieId)
        await addToWatchlist({ movieId }).then(() => {
          Alert.alert(`"${tmdbMovie.title[i18n.language]}" ${t('overall:add_watchlist')}`)
        })
    } catch (error) {
      catchConvexError(error)
    } finally {
      setSaveLoading(undefined)
    }
  }

  const handleWatch: ListViewItemActionProps['onPress'] = async (movie) => {
    if (!results) return
    if (!isAuthenticated) navigation.navigate('auth')
    else setSelectedMovie(movie)
    setCalendarDropdown(true)
  }

  const watchMovie = async (): Promise<void> => {
    if (!results) return

    try {
      const tmdbMovie = results.find((original) => {
        return original.id === selectedMovie
      })
      if (!tmdbMovie) throw Error

      const movieId = await getOrCreateMovie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: tmdbMovie.release_date,
        voteAverage: tmdbMovie.vote_average,
        originalLanguage: tmdbMovie.original_language,
        posterPath: tmdbMovie.poster_path,
      })

      if (movieId) await markAsWatched({ movieId, watchedAt: date.getTime() })
    } catch (error) {
      catchConvexError(error)
    } finally {
      setSelectedMovie(undefined)
      setCalendarDropdown(false)
    }
  }

  const footer = (
    <View style={[styles.footer]}>
      <SearchInput
        autoFocus
        style={styles.input}
        debounce={2000}
        onChangeText={() => {
          setLoading(true)
        }}
        onDebouncedText={handleSearch}
        onClear={() => {
          setResults([])
          setLoading(false)
        }}
      />
      <IconButton
        onPress={navigation.goBack}
        icon={<IconX />}
      />
    </View>
  )

  const noResultsState = (
    <View style={styles.content}>
      <DottedText>{t('search:no_results')}</DottedText>
    </View>
  )
  const emptyState = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Typography color={theme.semantics.background.foreground.light}>
          {t('search:empty_state')}
        </Typography>
      )}
    </View>
  )

  return (
    <>
      <ListView
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        header={footer}
        data={refinedResults}
        empty={results?.length === 0 ? noResultsState : emptyState}
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
        <View style={styles.calendarFooter}>
          <Button
            title={t('search:cancel')}
            onPress={() => setCalendarDropdown(false)}
          />
          <Button
            title={t('search:submit')}
            variant="accent"
            onPress={watchMovie}
          />
        </View>
      </Dropdown>
    </>
  )
}

export default Search
