import { Ref } from 'react'
import { View, ViewProps } from 'react-native'

export type BoxKeys = 'accent' | 'container' | 'positive' | 'negative' | 'caution' | 'background'

export type BoxType = Record<BoxKeys, boolean>

export interface BoxProps extends ViewProps, BoxType {
  ref: Ref<View>
}
