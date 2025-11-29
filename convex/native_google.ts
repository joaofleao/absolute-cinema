import { internal } from './_generated/api'
import { createAccount, retrieveAccount } from '@convex-dev/auth/server'

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
      // User exists, return their ID
      console.log('User exists, returning their ID')
      return { userId: existingAccount.user._id }
    }
  } catch (error) {
    console.log('User does not exist, creating user')
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
