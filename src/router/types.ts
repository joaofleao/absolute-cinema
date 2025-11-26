import { Id } from 'convex/_generated/dataModel'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type StackProps = {
  home: undefined
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
  profile: undefined
}

export type ScreenProps<T extends keyof StackProps> = NativeStackScreenProps<StackProps, T>
export type ScreenType<T extends keyof StackProps> = (props: ScreenProps<T>) => React.ReactElement
