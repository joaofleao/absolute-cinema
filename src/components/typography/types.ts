import { TextProps } from 'react-native'

import { BoxKeys } from '@components/box'

export interface TypographyProps extends TextProps {
  display?: boolean
  onboardingAccent?: boolean
  onboarding?: boolean
  header?: boolean
  title?: boolean
  body?: boolean
  description?: boolean
  legend?: boolean

  color?: BoxKeys
}
