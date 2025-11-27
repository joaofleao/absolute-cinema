import { action } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

// Request deletion of account to the administrator email
export const deleteAccount = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Absolute Cinema <absolute-cinema@joaofleao.com>',
        to: process.env.ADMINISTRATOR_EMAIL,
        subject: 'User requesting deletion of account',
        text: `The user "${userId}" has requested to have his account deleted`,
      }),
    })

    if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))

    return { success: true }
  },
})
