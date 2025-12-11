import { internal } from './_generated/api'
import { createAccount, retrieveAccount } from '@convex-dev/auth/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const nativeGoogleHandler = async (credentials: any, ctx: any) => {
  const { idToken, user } = credentials.data
  const { id: clientGoogleUserId, name } = user

  if (!idToken || !clientGoogleUserId) {
    throw new Error('Invalid Google credentials')
  }

  const validatedTokenData = await ctx.runAction(internal.node.verifyTokenGoogle, {
    idToken: idToken as string,
  })

  if (validatedTokenData.userid !== clientGoogleUserId) {
    throw new Error('User ID mismatch')
  }

  const existingAccount = await retrieveAccount(ctx, {
    provider: 'native-google',
    account: { id: validatedTokenData.email },
  })

  if (existingAccount) {
    return { userId: existingAccount.user._id }
  }

  const createdAccount = await createAccount(ctx, {
    provider: 'native-google',
    account: { id: validatedTokenData.email },
    profile: {
      email: validatedTokenData.email,
      name: name,
      emailVerificationTime: Date.now(),
    },
    shouldLinkViaEmail: true,
  })

  return { userId: createdAccount.user._id }
}
