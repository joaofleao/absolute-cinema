import { v } from 'convex/values'

import { action, mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const searchMovies = action({
  args: { query: v.string(), language: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(args.query)}`

    if (args.language) {
      url += `&language=${encodeURIComponent(args.language)}`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to search movies')
    }

    const data = await response.json()
    return data.results.slice(0, 10) // Return top 10 results
  },
})

// Get or create a movie in our database
export const getOrCreateMovie = mutation({
  args: {
    tmdbId: v.number(),
    title: v.string(),
    posterPath: v.optional(v.string()),
    releaseDate: v.string(),
    voteAverage: v.number(),
    originalLanguage: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if movie already exists
    const existingMovie = await ctx.db
      .query('movies')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingMovie) {
      return existingMovie._id
    }

    // Create new movie
    return await ctx.db.insert('movies', args)
  },
})

export const getMovie = mutation({
  args: {
    tmdbId: v.number(),
  },
  handler: async (ctx, args) => {
    const existingMovie = await ctx.db
      .query('movies')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingMovie) {
      return existingMovie
    }
  },
})

// Add movie to watchlist
export const addToWatchlist = mutation({
  args: { movieId: v.id('movies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Check if already in watchlist
    const existing = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { addedAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert('watchlist', {
      userId,
      movieId: args.movieId,
      addedAt: Date.now(),
    })
  },
})

// Remove from watchlist
export const removeFromWatchlist = mutation({
  args: { movieId: v.id('movies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const watchlistItem = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

// Remove from watched movies
export const removeFromWatchedMovies = mutation({
  args: { watchId: v.id('watchedMovies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const watchlistItem = await ctx.db
      .query('watchedMovies')
      .withIndex('by_id', (q) => q.eq('_id', args.watchId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

// Mark movie as watched
export const markAsWatched = mutation({
  args: { movieId: v.id('movies'), watchedAt: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Add to watched movies
    await ctx.db.insert('watchedMovies', {
      userId,
      movieId: args.movieId,
      watchedAt: args.watchedAt,
    })

    // Remove from watchlist if it exists
    const watchlistItem = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

// Get user's watchlist
export const getUserWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const watchlistItems = await ctx.db
      .query('watchlist')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const movies = await Promise.all(
      watchlistItems.map(async (item) => {
        const movie = await ctx.db.get(item.movieId)
        return { ...movie!, addedAt: item.addedAt }
      }),
    )

    return movies.filter(Boolean)
  },
})

// Get user's watched movies
export const getUserWatchedMovies = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const watchedItems = await ctx.db
      .query('watchedMovies')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()

    const movies = await Promise.all(
      watchedItems.map(async (item) => {
        const movie = await ctx.db.get(item.movieId)
        return { ...movie!, watchedAt: item.watchedAt, watchId: item._id }
      }),
    )

    return movies.filter(Boolean)
  },
})

// Check if movie is in user's watchlist
export const isInWatchlist = query({
  args: { movieId: v.id('movies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return false

    const item = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    return !!item
  },
})

// Check if movie has been watched by user
export const hasWatchedMovie = query({
  args: { movieId: v.id('movies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return false

    const item = await ctx.db
      .query('watchedMovies')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .first()

    return !!item
  },
})
