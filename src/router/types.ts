import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type StackProps = {
  home: undefined
  movie: undefined
}

export type ScreenProps<T extends keyof StackProps> = NativeStackScreenProps<StackProps, T>

export type ScreenType<T extends keyof StackProps> = (props: ScreenProps<T>) => React.ReactElement
