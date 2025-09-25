import Resend from '@auth/core/providers/resend'
import { generateRandomString, RandomReader } from '@oslojs/crypto/random'

export const verify = Resend({
  id: 'resend-otp',
  apiKey: process.env.RESEND_API_KEY,

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

  async sendVerificationRequest({ identifier: to, provider, url, token }) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Absolute Cinema <absolute-cinema@joaofleao.com>',
        to,
        subject: 'Sign in to Absolute Cinema',
        text: 'Sign in with the code ' + token,
      }),
    })

    if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
  },
})
