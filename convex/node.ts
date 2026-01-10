'use node'

import { v } from 'convex/values'
import { OAuth2Client } from 'google-auth-library'
import verifyAppleToken from 'verify-apple-id-token'

import { internalAction } from './_generated/server'

export const verifyTokenApple = internalAction({
  args: { identityToken: v.string() },
  handler: async (ctx, { identityToken }) => {
    const jwtClaims = await verifyAppleToken({
      idToken: identityToken,
      clientId: 'com.joaofleao.absolute-cinema',
    })

    return {
      email: jwtClaims.email,
      userid: jwtClaims.sub,
    }
  },
})

export const verifyTokenGoogle = internalAction({
  args: { idToken: v.string() },
  handler: async (ctx, { idToken }) => {
    const client = new OAuth2Client()
    const result = await client.verifyIdToken({
      idToken,
      audience: '674386239678-bnrobvq969mockak51tqpbgpjb0lu1qq.apps.googleusercontent.com',
    })

    const payload = result.getPayload()

    return {
      email: payload?.email,
      name: payload?.name,
      userid: payload?.sub,
    }
  },
})
