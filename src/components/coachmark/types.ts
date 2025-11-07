import { RefObject } from 'react'
import { View, ViewProps } from 'react-native'

export type CoachmarkProps = ViewProps & {
  anchor: RefObject<View | null>
  title?: string
  description?: string
  visible?: boolean
  onNext?: () => void
  onPrevious?: () => void
  onComplete?: () => void
}
