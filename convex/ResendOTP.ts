import { Resend as ResendAPI } from 'resend'

import Resend from '@auth/core/providers/resend'
import { generateRandomString, RandomReader } from '@oslojs/crypto/random'

export const ResendOTP = Resend({
  id: 'resend-otp',
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes)
      },
    }

    const alphabet = '0123456789'
    const length = 4
    return generateRandomString(random, alphabet, length)
  },

  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey)
    const emailFormat = {
      from: 'My App <onboarding@resend.dev>',
      to: [email],
      subject: `Sign in to Absolute Cinema`,
      text: 'Your code is ' + token,
    }
    const { error } = await resend.emails.send(emailFormat)
    console.log(provider.apiKey, error)

    // if (error) {
    //   // throw new Error('Could not send')
    // }
  },
})
