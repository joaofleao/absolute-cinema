import React from 'react'

import AuthContext from './context'
import { type AuthContextType } from './types'

const AuthProvider = ({ children }: { children?: React.ReactNode }): React.ReactElement => {
  const value: AuthContextType = {}

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
