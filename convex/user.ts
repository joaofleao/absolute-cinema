import { ConvexError, v } from 'convex/values'

import { action, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const getCurrentUser = query({
  args: {},
  returns: v.object({
    _id: v.id('users'),
    _creationTime: v.number(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Invalid user data received')
    const user = await ctx.db.get(userId)
    if (!user) throw new ConvexError('Invalid user data received')
    return user
  },
})

export const deleteAccount = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

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

    if (!res.ok) throw new ConvexError('Resend error: ' + JSON.stringify(await res.json()))
  },
})

// export const deleteAccount = mutation({
//   args: {},
//   returns: v.null(),
//   handler: async (ctx) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw new ConvexError('Not authenticated')

//     // Delete all user's watchlist entries
//     const watchlistItems = await ctx.db
//       .query('watchlist')
//       .withIndex('by_user', (q) => q.eq('userId', userId))
//       .collect()

//     for (const item of watchlistItems) {
//       await ctx.db.delete(item._id)
//     }

//     // Delete all user's watched movies entries
//     const watchedItems = await ctx.db
//       .query('watchedMovies')
//       .withIndex('by_user', (q) => q.eq('userId', userId))
//       .collect()

//     for (const item of watchedItems) {
//       await ctx.db.delete(item._id)
//     }

//     // Delete all user's movie list enrollments
//     const enrollments = await ctx.db
//       .query('movieListEnrollments')
//       .withIndex('by_user', (q) => q.eq('userId', userId))
//       .collect()

//     for (const enrollment of enrollments) {
//       await ctx.db.delete(enrollment._id)
//     }

//     // Delete all movie lists created by the user
//     const createdLists = await ctx.db
//       .query('movieLists')
//       .withIndex('by_creator', (q) => q.eq('createdBy', userId))
//       .collect()

//     for (const list of createdLists) {
//       // First delete all enrollments for this list
//       const listEnrollments = await ctx.db
//         .query('movieListEnrollments')
//         .withIndex('by_list', (q) => q.eq('movieListId', list._id))
//         .collect()

//       for (const enrollment of listEnrollments) {
//         await ctx.db.delete(enrollment._id)
//       }

//       // Then delete the list itself
//       await ctx.db.delete(list._id)
//     }

//     // Finally, delete the user account
//     await ctx.db.delete(userId)
//   },
// })

export const reportError = action({
  args: {
    message: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Absolute Cinema <absolute-cinema@joaofleao.com>',
        to: process.env.ADMINISTRATOR_EMAIL,
        subject: 'Unknown error reported',
        text: `A user has reporter an error:\n\n${args.message}`,
      }),
    })

    if (!res.ok) throw new ConvexError('Resend error: ' + JSON.stringify(await res.json()))
  },
})
