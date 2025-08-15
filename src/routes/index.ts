import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackProps = {
  home: undefined;
  movie: { message: string };
};

export const routes: { [K in keyof StackProps]: K } = {
  home: 'home',
  movie: 'movie',
};

type ScreenProps<K extends keyof StackProps> = NativeStackScreenProps<
  StackProps,
  K
>;

export type ScreenType<K extends keyof StackProps> = (
  props: ScreenProps<K>
) => React.ReactElement;
