import { internal } from './_generated/api'
import { createAccount, retrieveAccount } from '@convex-dev/auth/server'

export const nativeAppleHandler = async (credentials: any, ctx: any) => {
  // Extract the identity token from the credentials
  const { identityToken, user: clientAppleUserId } = credentials

  if (!identityToken || !clientAppleUserId) {
    throw new Error('Invalid Apple credentials')
  }

  const validatedTokenData = await ctx.runAction(internal.node.verifyToken, {
    identityToken: identityToken as string,
  })

  // Verify that the user ID from the token matches the one from the client
  if (validatedTokenData.appleUserId !== clientAppleUserId) {
    throw new Error('User ID mismatch')
  }

  try {
    // Check if user already exists
    const existingAccount = await retrieveAccount(ctx, {
      provider: 'native-apple',
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
      name: 'User',
      emailVerificationTime: Date.now(),
    },
    shouldLinkViaEmail: true,
  })

  return { userId: createdAccount.user._id }
}
