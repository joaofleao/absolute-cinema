import { ConvexError, v } from 'convex/values'

import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './_generated/server'

export const patchCountry = internalMutation({
  args: {
    tmdbId: v.number(),
    originCountry: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const movie = await ctx.db
      .query('movies')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (!movie) throw new ConvexError('Movie not found')
    await ctx.db.patch(movie._id, {
      originCountry: args.originCountry,
    })
  },
})

export const getAllMovies = internalQuery({
  args: {},
  returns: v.array(v.number()),
  handler: async (ctx) => {
    const movies = await ctx.db.query('movies').collect()
    return movies.map((movie) => movie.tmdbId)
  },
})

export const populateOriginCountry = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const movies = await ctx.runQuery(internal.populate.getAllMovies)

    for (const movie of movies) {
      try {
        const movieDetails = await ctx.runAction(internal.movies.fetchMovie, {
          tmdbId: movie,
        })
        if (!movieDetails) {
          console.error('populateOriginCountry: fetchMovie returned no data', {
            tmdbId: movie,
          })
          continue
        }
        const originCountry = Array.isArray((movieDetails as any).originCountry)
          ? (movieDetails as any).originCountry
          : []
        await ctx.runMutation(internal.populate.patchCountry, {
          tmdbId: movie,
          originCountry,
        })
      } catch (error) {
        console.error('populateOriginCountry: failed to fetch or patch movie', {
          tmdbId: movie,
          error,
        })
        continue
      }
    }
  },
})
