import { StackProps } from './types'

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',
  login: 'login',
  movie: 'movie',
  password_recovery: 'password_recovery',
  search: 'search',
  sign_up: 'sign_up',
}

export * from './types'
