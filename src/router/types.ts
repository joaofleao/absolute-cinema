import { GenericId } from 'convex/values'

// import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type StackProps = {
  movies: undefined
  profile: undefined
  search: undefined

  movie: undefined
  password_recovery: undefined
  watched_movie: {
    movie: {
      watchedAt: number
      watchId: GenericId<'watchedMovies'>
      _id: GenericId<'movies'>
      _creationTime: number
      tmdbId: number
      title: string
      posterPath: string
      plot?: string
      releaseDate?: string
      voteAverage?: number
      originalLanguage?: string
      status?: string
      backdropPath?: string
      imdbId?: string
      runtime?: number
      tagline?: string
    }
  }

  auth: undefined
  onboarding: undefined
}

export type ScreenProps<T extends keyof StackProps> = NativeStackScreenProps<StackProps, T>
export type ScreenType<T extends keyof StackProps> = (props: ScreenProps<T>) => React.ReactElement

// export type TabProps<T extends keyof StackProps> = BottomTabScreenProps<StackProps, T>
// export type TabType<T extends keyof StackProps> = (props: TabProps<T>) => React.ReactElement
