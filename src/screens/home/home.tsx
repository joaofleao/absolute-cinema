import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Alert, Dimensions, Image, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Avatar from '@components/avatar'
import Bar from '@components/bar'
import Button from '@components/button'
import DottedText from '@components/dotted_text'
import Dropdown from '@components/dropdown'
import GalleryView from '@components/gallery_view'
import { IconGallery, IconList, IconMagnifyingGlass } from '@components/icon'
import IconButton from '@components/icon_button'
import ListView from '@components/list_view'
import { ListViewItemActionProps } from '@components/list_view/list_view_item'
import Select from '@components/select'
import { TinyArrow, TinyCheckmark, TinyChevron, TinyPlus } from '@components/tiny_icon'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { routes, ScreenType } from '@router'
import { LanguageCode, languages } from '@utils/languages'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  const getMovie = useMutation(api.movies.getMovie)
  const markAsWatched = useMutation(api.movies.markAsWatched)
  const addToWatchlist = useMutation(api.movies.addToWatchlist)
  const removeFromWatchlist = useMutation(api.movies.removeFromWatchlist)
  const [calendarDropdown, setCalendarDropdown] = useState(false)
  const [date, setDate] = useState<Date>(new Date(Date.now()))
  const [saveLoading, setSaveLoading] = useState<number>()
  const [selectedMovie, setSelectedMovie] = useState<number>()

  const watchlist = useQuery(api.movies.getUserWatchlist) || []
  const watchedMovies = useQuery(api.movies.getUserWatchedMovies) || []
  const uniqueYears = watchedMovies
    .map((movie) => new Date(movie.watchedAt).getFullYear())
    .filter((year, index, self) => self.indexOf(year) === index)
    .map((year) => ({
      id: year,
      name: year.toString(),
    }))

  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery')
  const [year, setYear] = useState<number>(uniqueYears.length === 0 ? 0 : new Date().getFullYear())

  const [list, setList] = useState<'watchlist' | 'watchedMovies'>('watchedMovies')
  const [sort, setSort] = useState<'ascending' | 'descending'>('ascending')

  const isSaveLoading: ListViewItemActionProps['loading'] = (movie): boolean => {
    return movie === saveLoading
  }
  const handleSave: ListViewItemActionProps['onPress'] = async (movie) => {
    setSaveLoading(movie)
    try {
      const existingMovie = await getMovie({ tmdbId: movie })
      if (existingMovie)
        await addToWatchlist({ movieId: existingMovie._id }).then(() => {
          Alert.alert(`"${existingMovie.title}" added to your watchlist`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to add movie to watchlist')
    } finally {
      setSaveLoading(undefined)
    }
  }

  const handleWatch: ListViewItemActionProps['onPress'] = async (movie) => {
    setSelectedMovie(movie)
    setCalendarDropdown(true)
  }

  const watchMovie = async (): Promise<void> => {
    if (!selectedMovie) return
    try {
      const existingMovie = await getMovie({ tmdbId: selectedMovie })

      if (existingMovie)
        await markAsWatched({ movieId: existingMovie._id, watchedAt: date.getTime() }).then(() => {
          Alert.alert(`"${existingMovie.title}" marked as watched`)
        })
    } catch (error: any) {
      Alert.alert(error.message || 'Failed to mark movie as watched')
    } finally {
      setSelectedMovie(undefined)
      setCalendarDropdown(false)
    }
  }

  const data = {
    watchlist: watchlist
      .sort((a, b) =>
        sort === 'ascending'
          ? new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
          : new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      )
      .filter((movie) => new Date(movie.addedAt).getFullYear() === year || year === 0)
      .map((movie) => ({
        _id: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        date: new Date(movie.addedAt).toLocaleDateString(),
        voteAverage: movie.voteAverage,
        language:
          languages[movie.originalLanguage as LanguageCode][i18n.language as 'en-US' | 'pt-BR'],
        onLongPress: async (): Promise<void> => {
          setSaveLoading(movie.tmdbId)
          try {
            await removeFromWatchlist({ movieId: movie._id }).then(() =>
              Alert.alert(`"${movie.title}" removed from your watchlist`),
            )
          } catch (error: any) {
            Alert.alert(error.message || 'Failed to remove movie to watchlist')
          } finally {
            setSaveLoading(undefined)
          }
        },
      })),

    watchedMovies: watchedMovies
      .sort((a, b) =>
        sort === 'ascending'
          ? new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime()
          : new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime(),
      )
      .filter((movie) => new Date(movie.watchedAt).getFullYear() === year || year === 0)
      .map((movie) => ({
        id: movie.watchId,
        _id: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        date: new Date(movie.watchedAt).toLocaleDateString(),
        voteAverage: movie.voteAverage,
        language:
          languages[movie.originalLanguage as LanguageCode][i18n.language as 'en-US' | 'pt-BR'],
        onPress: (): void => navigation.navigate('watched_movie', { movie }),
      })),
  }

  const { width } = Dimensions.get('window')
  const header = (
    <>
      <View style={styles.gradientContainer}>
        <RadialGradient
          style={styles.gradient}
          colors={[theme.primitives.vibrant.ruby[15], theme.semantics.background.base.default]}
          radius={300}
          center={[width / 2, width]}
        />
      </View>
      <View style={styles.banner}>
        <Image
          style={styles.logo}
          source={require('@assets/mascot.png')}
        />

        <View style={styles.title}>
          <Typography color={theme.semantics.background.foreground.light}>ABSOLUTE</Typography>
          <Typography display>CINEMA</Typography>
        </View>
        <Authenticated>
          <View style={styles.content}>
            <Bar.Root>
              <Select
                label={t('home:select_year')}
                data={[{ name: t('home:all'), id: 0 }, ...uniqueYears]}
                onSelect={setYear}
                selected={year}
                renderAnchor={({ selectedOption, setVisible, visible }) => (
                  <Bar.Item
                    onPress={() => setVisible(true)}
                    icon={<TinyChevron />}
                  >
                    {selectedOption?.name as string}
                  </Bar.Item>
                )}
              />

              <Select
                label={t('home:select_year')}
                data={[
                  { id: 'watchedMovies', name: t('home:watched') },
                  { id: 'watchlist', name: t('home:watchlist') },
                ]}
                onSelect={setList}
                selected={list}
                renderAnchor={({ selectedOption, setVisible, visible }) => (
                  <Bar.Item
                    onPress={() => setVisible(true)}
                    icon={<TinyChevron />}
                  >
                    {selectedOption?.name as string}
                  </Bar.Item>
                )}
              />

              <Bar.Item
                onPress={() =>
                  setSort((prev) => (prev === 'ascending' ? 'descending' : 'ascending'))
                }
                icon={<TinyArrow orientation={sort === 'ascending' ? 'up' : 'down'} />}
              >
                {t('home:by_date')}
              </Bar.Item>
            </Bar.Root>
          </View>
        </Authenticated>
      </View>
    </>
  )

  const emptyState = (
    <Authenticated>
      <View style={styles.content}>
        <DottedText>{t('home:empty_state')}</DottedText>
      </View>
    </Authenticated>
  )

  return (
    <>
      {viewMode === 'gallery' && (
        <GalleryView
          data={data[list]}
          header={header}
          empty={emptyState}
        />
      )}

      {viewMode === 'list' && (
        <ListView
          data={data[list]}
          header={header}
          empty={emptyState}
          topButton={{
            title: t('home:watch'),
            icon: <TinyCheckmark />,
            onPress: handleWatch,
          }}
          bottomButton={{
            title: list === 'watchlist' ? t('home:bump') : t('home:save'),
            icon: list === 'watchlist' ? <TinyArrow /> : <TinyPlus />,
            loading: isSaveLoading,
            onPress: handleSave,
          }}
        />
      )}

      <View style={styles.footer}>
        <IconButton
          onPress={() => navigation.navigate(routes.search)}
          icon={<IconMagnifyingGlass />}
        />
      </View>

      <View style={styles.header}>
        <Authenticated>
          <IconButton
            onPress={() => {
              setViewMode((prev) => (prev === 'gallery' ? 'list' : 'gallery'))
            }}
            icon={viewMode === 'gallery' ? <IconList /> : <IconGallery />}
          />
          <Avatar onPress={() => navigation.navigate(routes.profile)} />
        </Authenticated>

        <Unauthenticated>
          <View />
          <Avatar
            onPress={() => navigation.navigate(routes.auth)}
            label={t('auth:sign_in')}
          />
        </Unauthenticated>
      </View>
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

export default Home
