import { useContext } from 'react'

import SettingsContext from './context'
import { type SettingsType } from './types'

const useSettings = (): SettingsType => {
  const useSettingsContext = useContext(SettingsContext)

  if (useSettingsContext === null) {
    throw new Error('useSettings has to be used within <SettingsContext.Provider>')
  }
  return useSettingsContext
}

export default useSettings
