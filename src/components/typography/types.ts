import { TextProps } from 'react-native'

export interface TypographyProps extends TextProps {
  display?: boolean
  header?: boolean
  description?: boolean
  section?: boolean
  primary?: boolean
  secondary?: boolean
  title?: boolean
  light?: boolean
}
