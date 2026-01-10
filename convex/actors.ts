import { ConvexError, v } from 'convex/values'

import { action, mutation } from './_generated/server'

export const searchActors = action({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      id: v.number(),
      name: v.string(),
      profile_path: v.optional(v.string()),
      known_for: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(args.query)}&page=${encodeURIComponent(args.page ?? 1)}&language=en-US`

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      accept: 'application/json',
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new ConvexError('Failed to search actors')
    }

    const data: { results: any[] } = await response.json()

    return data.results
      .filter((person) => person.known_for_department === 'Acting')
      .map((person) => ({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
        known_for: person.known_for?.map((item: any) => item.title || item.name).join(', ') || '',
      }))
  },
})

export const getOrCreateActor = mutation({
  args: {
    tmdbId: v.number(),
    name: v.string(),
    picture_path: v.optional(v.string()),
  },
  returns: v.id('actors'),
  handler: async (ctx, args) => {
    const existingActor = await ctx.db
      .query('actors')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingActor) {
      return existingActor._id
    }

    return await ctx.db.insert('actors', args)
  },
})

export const getActor = mutation({
  args: {
    tmdbId: v.number(),
  },
  returns: v.object({
    _id: v.id('actors'),
    _creationTime: v.number(),
    tmdbId: v.number(),
    picture_path: v.optional(v.string()),
    name: v.string(),
  }),

  handler: async (ctx, args) => {
    const existingActor = await ctx.db
      .query('actors')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (!existingActor) throw new ConvexError('Actor not found')
    return existingActor
  },
})
