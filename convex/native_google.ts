import { internal } from './_generated/api'
import { createAccount, retrieveAccount } from '@convex-dev/auth/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const nativeGoogleHandler = async (credentials: any, ctx: any) => {
  // Extract the identity token from the credentials
  const { idToken, user } = credentials.data
  const { id: clientGoogleUserId, name } = user

  if (!idToken || !clientGoogleUserId) {
    throw new Error('Invalid Google credentials')
  }

  const validatedTokenData = await ctx.runAction(internal.node.verifyTokenGoogle, {
    idToken: idToken as string,
  })

  // Verify that the user ID from the token matches the one from the client
  if (validatedTokenData.userid !== clientGoogleUserId) {
    throw new Error('User ID mismatch')
  }

  try {
    // Check if user already exists
    const existingAccount = await retrieveAccount(ctx, {
      provider: 'native-google',
      account: { id: validatedTokenData.email },
    })

    if (existingAccount) {
      return { userId: existingAccount.user._id }
    }
  } catch (error) {
    throw error
  }

  const createdAccount = await createAccount(ctx, {
    provider: 'native-apple',
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
