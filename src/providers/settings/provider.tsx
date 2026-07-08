import React from 'react'

import SettingsContext from './context'
import type { SettingsType } from './types'

const SettingsProvider = ({ children }: { children?: React.ReactNode }): React.ReactElement => {
  const [viewMode, setViewMode] = React.useState<'gallery' | 'list'>('gallery')

  const value = {
    viewMode,
    setViewMode,
  } satisfies SettingsType

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export default SettingsProvider
