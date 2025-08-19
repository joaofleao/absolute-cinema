import { StackProps } from './types'

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',
  movie: 'movie',
}

export * from './types'
export { default } from './router'
