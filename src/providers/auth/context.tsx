import { createContext } from 'react'

import type { AuthContextType } from './types'

const AuthContext = createContext<AuthContextType | null>(null)
AuthContext.displayName = 'AuthContext'
export default AuthContext
