import { type ParamListBase } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

export interface ScreenProps extends ParamListBase {
  home: undefined;
}

export type HomeProps = NativeStackScreenProps<ScreenProps, 'home'>;
