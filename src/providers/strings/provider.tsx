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
    email: {
      placeholder: t('overall:email_placeholder'),
    },
    password: {
      placeholder: t('overall:password_placeholder'),
      confirmationPlaceholder: t('overall:password_confirmation_placeholder'),
    },
  }

  return <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
}

export default StringsProvider
