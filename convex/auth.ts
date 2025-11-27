import { verify } from './verify'
import Apple from '@auth/core/providers/apple'
import { Password } from '@convex-dev/auth/providers/Password'
import { convexAuth } from '@convex-dev/auth/server'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({ verify }),
    Apple({
      profile: (appleInfo) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined
        return {
          id: appleInfo.sub,
          name: name,
          email: appleInfo.email,
        }
      },
    }),
  ],
})
