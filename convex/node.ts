'use node'

import { v } from 'convex/values'
import verifyAppleToken from 'verify-apple-id-token'

import { internalAction } from './_generated/server'

export const verifyToken = internalAction({
  args: { identityToken: v.string() },
  handler: async (ctx, { identityToken }) => {
    const jwtClaims = await verifyAppleToken({
      idToken: identityToken,
      clientId: 'com.joaofleao.absolute-cinema',
    })

    return {
      email: jwtClaims.email,
      appleUserId: jwtClaims.sub,
    }
  },
})
