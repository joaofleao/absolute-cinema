import { StackProps } from './types'

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',
  movie: 'movie',
  search: 'search',
}

export * from './types'
