import { TextProps } from 'react-native'

export interface TypographyProps extends TextProps {
  display?: boolean
  onboardingAccent?: boolean
  onboarding?: boolean
  header?: boolean
  title?: boolean
  body?: boolean
  description?: boolean
  legend?: boolean

  color?: string
}
