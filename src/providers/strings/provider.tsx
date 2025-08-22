import React from 'react'
import { useTranslation } from 'react-i18next'

import StringsContext from './context'
import { type StringsContextType } from './types'

const StringsProvider = ({ children }: { children?: React.ReactNode }): React.ReactElement => {
  const { t } = useTranslation()
  const value: StringsContextType = {
    search: {
      placeholder: t('overall:search_placeholder'),
    },
  }

  return <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
}

export default StringsProvider
