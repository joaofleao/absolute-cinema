import { createContext } from 'react'

import type { SettingsType } from './types'

const SettingsContext = createContext<SettingsType | null>(null)
SettingsContext.displayName = 'SettingsContext'

export default SettingsContext
