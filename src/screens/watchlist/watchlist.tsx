import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Alert, Dimensions, Image, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { GenericId } from 'convex/values'
import { useTranslation } from 'react-i18next'
import useConvexErrorHandler from 'src/hooks/useConvexErrorHandler'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Avatar from '@components/avatar'
import Bar from '@components/bar'
import Button from '@components/button'
import DottedText from '@components/dotted_text'
import Dropdown from '@components/dropdown'
import GalleryView from '@components/gallery_view'
import ListView from '@components/list_view'
import { ListViewItemActionProps } from '@components/list_view/list_view_item'
import { TinyArrow, TinyCheckmark } from '@components/tiny_icon'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { TabType } from '@router/types'
import { LanguageCode, languages } from '@utils/languages'

const Watchlist: TabType<'watchlist'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  const markAsWatched = useMutation(api.movies.markAsWatched)
  const addToWatchlist = useMutation(api.movies.addToWatchlist)
  const removeFromWatchlist = useMutation(api.movies.removeFromWatchlist)
  const [calendarDropdown, setCalendarDropdown] = useState(false)
  const [date, setDate] = useState<Date>(new Date(Date.now()))
  const [saveLoading, setSaveLoading] = useState<string>()
  const [selectedMovie, setSelectedMovie] = useState<GenericId<'movies'>>()
  const catchConvexError = useConvexErrorHandler()

  const watchlist = useQuery(api.movies.getUserWatchlist) || []
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery')
  const [sort, setSort] = useState<'ascending' | 'descending'>('ascending')

  const isSaveLoading: ListViewItemActionProps['loading'] = (movie): boolean => {
    return movie === saveLoading
  }

  const handleSave: ListViewItemActionProps['onPress'] = async (movie) => {
    setSaveLoading(movie)
    try {
      await addToWatchlist({ movieId: movie as GenericId<'movies'> }).then(() => {
        Alert.alert(`${t('overall:add_watchlist')}`)
      })
    } catch (error) {
      catchConvexError(error)
    } finally {
      setSaveLoading(undefined)
    }
  }

  const handleWatch: ListViewItemActionProps['onPress'] = async (movie) => {
    setSelectedMovie(movie as GenericId<'movies'>)
    setCalendarDropdown(true)
  }

  const watchMovie = async (): Promise<void> => {
    if (!selectedMovie) return
    try {
      await markAsWatched({ movieId: selectedMovie, watchedAt: date.getTime() })
    } catch (error) {
      catchConvexError(error)
    } finally {
      setSelectedMovie(undefined)
      setCalendarDropdown(false)
    }
  }

  const data = watchlist
    .sort((a, b) =>
      sort === 'ascending'
        ? new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        : new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
    )
    .map((movie) => ({
      _id: movie._id,
      title: movie.title,
      posterPath: movie.posterPath,
      date: new Date(movie.addedAt).toLocaleDateString(),
      voteAverage: movie.voteAverage,
      language: languages[movie.originalLanguage as LanguageCode][i18n.language],
      onLongPress: async (): Promise<void> => {
        setSaveLoading(movie._id)

        await removeFromWatchlist({ movieId: movie._id })
          .then(() =>
            Alert.alert(`"${movie.title[i18n.language]}" ${t('overall:remove_watchlist')}`),
          )
          .catch(catchConvexError)
          .finally(() => {
            setSaveLoading(undefined)
          })
      },
    }))

  const { width } = Dimensions.get('window')

  const header = (
    <>
      <View style={styles.gradientContainer}>
        <RadialGradient
          style={styles.gradient}
          colors={[theme.primitives.vibrant.ruby[15], theme.semantics.background.base.default]}
          radius={width / 1.5}
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
      </View>
      <Unauthenticated>
        <DottedText>{t('home:nothing')}</DottedText>
        <Typography
          onPress={() => navigation.navigate('auth')}
          color={theme.semantics.background.foreground.light}
        >
          {t('home:sign_in')}
        </Typography>
      </Unauthenticated>
      <Authenticated>
        <View style={styles.content}>
          <Bar.Root>
            <Bar.Item
              onPress={() => setViewMode((prev) => (prev === 'gallery' ? 'list' : 'gallery'))}
            >
              {viewMode === 'gallery' ? t('home:list') : t('home:gallery')}
            </Bar.Item>

            <Bar.Item
              onPress={() => setSort((prev) => (prev === 'ascending' ? 'descending' : 'ascending'))}
              icon={<TinyArrow orientation={sort === 'descending' ? 'up' : 'down'} />}
            >
              {t('home:by_date')}
            </Bar.Item>
          </Bar.Root>

          <Typography legend>
            {data.length} {data.length === 1 ? t('home:movies') : t('home:movies_plural')}
          </Typography>
        </View>
      </Authenticated>
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
          contentContainerStyle={styles.flatlists}
          data={data}
          header={header}
          empty={emptyState}
        />
      )}

      {viewMode === 'list' && (
        <ListView
          responsive
          contentContainerStyle={styles.flatlists}
          data={data}
          header={header}
          empty={emptyState}
          topButton={{
            title: t('home:watch'),
            icon: <TinyCheckmark />,
            onPress: handleWatch,
          }}
          bottomButton={{
            title: t('home:bump'),
            icon: <TinyArrow />,
            loading: isSaveLoading,
            onPress: handleSave,
          }}
        />
      )}

      <View style={styles.header}>
        <View />

        <Authenticated>
          <Avatar onPress={() => navigation.navigate('profile')} />
        </Authenticated>

        <Unauthenticated>
          <Avatar
            onPress={() => navigation.navigate('auth')}
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

export default Watchlist
