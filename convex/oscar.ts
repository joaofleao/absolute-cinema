import { v } from 'convex/values'

import { mutation } from './_generated/server'

// export const getMovie = mutation({
//   args: {
//     edition: v.number(),
//   },
//   handler: async (ctx, args) => {
//     const existingEdition = await ctx.db
//       .query('oscarEditions')
//       .withIndex('by_number', (q) => q.eq('number', args.edition))
//       .unique()
//     if (existingEdition) {
//       console.log(existingEdition)
//     }
//   },
// })

export const getOrCreateCategory = mutation({
  args: {
    id: v.string(),
    name: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('oscarCategories', args)
  },
})

export const getOrCreateActor = mutation({
  args: {
    tmdbId: v.number(),
    picture_path: v.optional(v.string()),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingPerson = await ctx.db
      .query('actors')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingPerson) {
      return existingPerson._id
    }

    return await ctx.db.insert('actors', args)
  },
})
