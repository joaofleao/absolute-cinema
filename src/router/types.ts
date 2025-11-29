import { Id } from 'convex/_generated/dataModel'

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type StackProps = {
  home: undefined
  profile: undefined
  watchlist: undefined
  watched: undefined

  movie: undefined
  password_recovery: undefined
  watched_movie: {
    movie: {
      watchedAt: number
      watchId: Id<'watchedMovies'>
      _id: Id<'movies'>
      _creationTime: number
      posterPath?: string | undefined
      tmdbId: number
      title: string
      releaseDate: string
      voteAverage: number
      originalLanguage: string
    }
  }
  search: undefined
  auth: undefined
}

export type ScreenProps<T extends keyof StackProps> = NativeStackScreenProps<StackProps, T>
export type ScreenType<T extends keyof StackProps> = (props: ScreenProps<T>) => React.ReactElement

export type TabProps<T extends keyof StackProps> = BottomTabScreenProps<StackProps, T>
export type TabType<T extends keyof StackProps> = (props: TabProps<T>) => React.ReactElement
