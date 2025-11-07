import { StackProps } from './types'

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',

  movie: 'movie',
  password_recovery: 'password_recovery',
  search: 'search',
  auth: 'auth',
  profile: 'profile',
}

export * from './types'
