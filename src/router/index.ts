import { StackProps } from './types'

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',
  watchlist: 'watchlist',
  watched: 'watched',
  profile: 'profile',

  movie: 'movie',
  onboarding: 'onboarding',
  password_recovery: 'password_recovery',
  watched_movie: 'watched_movie',
  search: 'search',
  auth: 'auth',
}

export * from './types'
