import { ConvexError, v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const getOscarEditions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('oscarEditions'),
      _creationTime: v.number(),
      number: v.number(),
      year: v.number(),
      date: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query('oscarEditions').order('desc').collect()
  },
})

export const createOscarEdition = mutation({
  args: {
    number: v.number(),
    year: v.number(),
    date: v.number(),
  },
  returns: v.id('oscarEditions'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    return await ctx.db.insert('oscarEditions', args)
  },
})

export const updateOscarEdition = mutation({
  args: {
    _id: v.id('oscarEditions'),
    number: v.number(),
    year: v.number(),
    date: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    const { _id, ...updates } = args

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    )
    await ctx.db.patch(_id, cleanUpdates)
  },
})

export const deleteOscarEdition = mutation({
  args: { _id: v.id('oscarEditions') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    await ctx.db.delete(args._id)
  },
})

export const getOscarCategories = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('oscarCategories'),
      _creationTime: v.number(),
      name: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      order: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query('oscarCategories').order('asc').collect()
  },
})

export const createOscarCategory = mutation({
  args: {
    name: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    order: v.number(),
  },
  returns: v.id('oscarCategories'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    return await ctx.db.insert('oscarCategories', args)
  },
})

export const updateOscarCategory = mutation({
  args: {
    _id: v.id('oscarCategories'),
    name: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    order: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    const { _id, ...updates } = args

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    )

    await ctx.db.patch(_id, cleanUpdates)
  },
})

export const deleteOscarCategory = mutation({
  args: { _id: v.id('oscarCategories') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    await ctx.db.delete(args._id)
  },
})

export const createOscarNomination = mutation({
  args: {
    movieId: v.id('movies'),
    editionId: v.id('oscarEditions'),
    categoryId: v.id('oscarCategories'),
    winner: v.optional(v.boolean()),
    nominee: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
    actorId: v.optional(v.id('actors')),
    character: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
    country: v.optional(v.string()),
    song: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  returns: v.id('oscarNomination'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')
    return await ctx.db.insert('oscarNomination', args)
  },
})

export const getNominationsByEdition = query({
  args: { editionId: v.id('oscarEditions') },
  returns: v.array(
    v.object({
      _id: v.id('oscarNomination'),
      movie: v.object({
        _id: v.id('movies'),
        title: v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
      }),
      category: v.object({
        _id: v.id('oscarCategories'),
        name: v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
      }),
      actor: v.optional(
        v.object({
          _id: v.id('actors'),
          name: v.string(),
        }),
      ),
      character: v.optional(
        v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
      ),
      nominee: v.optional(
        v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
      ),
      country: v.optional(v.string()),
      song: v.optional(v.string()),
      url: v.optional(v.string()),
      winner: v.optional(v.boolean()),
    }),
  ),

  handler: async (ctx, args) => {
    const nominations = await ctx.db
      .query('oscarNomination')
      .withIndex('by_edition', (q) => q.eq('editionId', args.editionId))
      .collect()

    const enrichedNominations = await Promise.all(
      nominations.map(async (nomination) => {
        const movie = await ctx.db.get(nomination.movieId)
        if (!movie) throw new ConvexError('Movie not found')

        const category = await ctx.db.get(nomination.categoryId)
        if (!category) throw new ConvexError('Category not found')

        const actor = nomination.actorId
          ? (await ctx.db.get(nomination.actorId)) || undefined
          : undefined

        return {
          ...nomination,
          movie: {
            _id: movie._id,
            title: movie.title,
          },
          category: {
            _id: category._id,
            name: category.name,
          },
          actor: actor
            ? {
                _id: actor._id,
                name: actor.name,
              }
            : undefined,
        }
      }),
    )

    return enrichedNominations
  },
})

export const updateOscarNomination = mutation({
  args: {
    nominationId: v.id('oscarNomination'),
    movieId: v.id('movies'),
    editionId: v.id('oscarEditions'),
    categoryId: v.id('oscarCategories'),

    winner: v.optional(v.boolean()),
    nominee: v.optional(
      v.object({
        pt_BR: v.optional(v.string()),
        en_US: v.optional(v.string()),
      }),
    ),
    actorId: v.optional(v.id('actors')),
    character: v.optional(
      v.object({
        pt_BR: v.optional(v.string()),
        en_US: v.optional(v.string()),
      }),
    ),
    country: v.optional(v.string()),
    song: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    const { nominationId, ...updates } = args
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    )

    await ctx.db.patch(nominationId, cleanUpdates)
  },
})

export const deleteOscarNomination = mutation({
  args: { nominationId: v.id('oscarNomination') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    await ctx.db.delete(args.nominationId)
  },
})
