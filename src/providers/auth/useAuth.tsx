import { useContext } from 'react'

import AuthContext from './context'
import { type AuthContextType } from './types'

const useAuth = (): AuthContextType => {
  const useAuthContext = useContext(AuthContext)

  if (useAuthContext === null) {
    throw new Error('useAuth has to be used within <AuthContext.Provider>')
  }
  return useAuthContext
}

export default useAuth
