import { useState } from 'react'
import { Dimensions, FlatList, Image, ListRenderItem, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { Authenticated, Unauthenticated, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'

import { api } from '../../../convex/_generated/api'
import useStyles from './styles'
import Avatar from '@components/avatar'
import Bar from '@components/bar'
import DottedText from '@components/dotted_text'
import GalleryItem from '@components/gallery_item'
import {
  IconArrow,
  IconChevron,
  IconGallery,
  IconList,
  IconMagnifyingGlass,
} from '@components/icon'
import IconButton from '@components/icon_button'
import ListItem from '@components/list_item'
import Select from '@components/select'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { routes, ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t } = useTranslation()
  const theme = useTheme()

  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery')

  // const watchlist = useQuery(api.movies.getUserWatchlist) || []
  const watchedMovies = useQuery(api.movies.getUserWatchedMovies) || []

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
      <View style={styles.header}>
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
              <Bar.Item icon={<IconChevron />}>2025</Bar.Item>
              <Bar.Item icon={<IconChevron />}>{t('home:watched')}</Bar.Item>
              <Bar.Item icon={<IconArrow />}>{t('home:by_date')}</Bar.Item>
            </Bar.Root>
          </View>
        </Authenticated>
      </View>
    </>
  )

  const renderGalleryItem: ListRenderItem<(typeof watchedMovies)[number]> = ({ item, index }) => (
    <GalleryItem
      onPress={() => alert('Pressed ' + item._id)}
      image={item.posterPath}
    />
  )
  const renderListItem: ListRenderItem<(typeof watchedMovies)[number]> = ({ item, index }) => (
    <ListItem
      onPress={() => alert('Pressed ' + item._id)}
      image={item.posterPath}
      title={item.title}
      date={new Date(item.watchedAt).toLocaleDateString()}
    />
  )

  return (
    <>
      {viewMode === 'gallery' && (
        <FlatList
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          style={styles.root}
          ListHeaderComponent={header}
          data={watchedMovies}
          keyExtractor={(movie) => movie._id + movie.watchedAt.toString()}
          renderItem={renderGalleryItem}
          ListEmptyComponent={() => (
            <Authenticated>
              <View style={styles.content}>
                <DottedText>{t('home:empty_state')}</DottedText>
              </View>
            </Authenticated>
          )}
        />
      )}
      {viewMode === 'list' && (
        <FlatList
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          style={styles.root}
          ListHeaderComponent={header}
          data={watchedMovies}
          keyExtractor={(movie) => movie._id + movie.watchedAt.toString()}
          renderItem={renderListItem}
          ListEmptyComponent={() => (
            <Authenticated>
              <View style={styles.content}>
                <DottedText>{t('home:empty_state')}</DottedText>
              </View>
            </Authenticated>
          )}
        />
      )}

      <View style={styles.footer}>
        <IconButton
          onPress={() => navigation.navigate(routes.search)}
          icon={<IconMagnifyingGlass />}
        />
      </View>

      <View style={styles.head}>
        <Authenticated>
          <Select
            onSelect={setViewMode}
            selected={viewMode}
            data={[
              { id: 'gallery', name: 'Gallery', icon: <IconList /> },
              { id: 'list', name: 'List', icon: <IconGallery /> },
            ]}
            label={'View Mode'}
            renderAnchor={({ selectedOption, setVisible }) => (
              <IconButton
                icon={selectedOption?.icon ?? <IconArrow />}
                onPress={() => setVisible(true)}
              />
            )}
          />

          <View />

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
    </>
  )
}

export default Home
