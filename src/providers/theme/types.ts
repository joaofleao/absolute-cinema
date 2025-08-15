import { ColorsType } from './colors';
import { FontsType } from './fonts';

export type ModeType = 'dark' | 'light';

export interface ThemeType {
  colors: ColorsType;
  fonts: FontsType;
}
