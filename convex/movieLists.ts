import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

// Create a new movie list
export const createMovieList = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    movies: v.array(v.number()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    return await ctx.db.insert('movieLists', {
      ...args,
      createdBy: userId,
    })
  },
})

// Get public movie lists
export const getPublicMovieLists = query({
  args: {},
  handler: async (ctx) => {
    const lists = await ctx.db
      .query('movieLists')
      .withIndex('by_public', (q) => q.eq('isPublic', true))
      .collect()

    return await Promise.all(
      lists.map(async (list) => {
        const creator = await ctx.db.get(list.createdBy)
        return {
          ...list,
          creatorName: creator?.name || creator?.email || 'Unknown',
        }
      }),
    )
  },
})

// Enroll in a movie list
export const enrollInMovieList = mutation({
  args: { movieListId: v.id('movieLists') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Check if already enrolled
    const existing = await ctx.db
      .query('movieListEnrollments')
      .withIndex('by_user_and_list', (q) =>
        q.eq('userId', userId).eq('movieListId', args.movieListId),
      )
      .unique()

    if (existing) {
      throw new Error('Already enrolled in this list')
    }

    return await ctx.db.insert('movieListEnrollments', {
      userId,
      movieListId: args.movieListId,
      enrolledAt: Date.now(),
    })
  },
})

// Get user's enrolled movie lists
export const getUserEnrolledLists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const enrollments = await ctx.db
      .query('movieListEnrollments')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const list = await ctx.db.get(enrollment.movieListId)
        if (!list) return null

        const creator = await ctx.db.get(list.createdBy)
        return {
          ...list,
          creatorName: creator?.name || creator?.email || 'Unknown',
          enrolledAt: enrollment.enrolledAt,
        }
      }),
    )
  },
})

// Get movie list progress for user
export const getMovieListProgress = query({
  args: { movieListId: v.id('movieLists') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const list = await ctx.db.get(args.movieListId)
    if (!list) return null

    // Get all movies in the list from our database
    const listMovies = await Promise.all(
      list.movies.map(async (tmdbId) => {
        const movie = await ctx.db
          .query('movies')
          .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', tmdbId))
          .unique()
        return movie
      }),
    )

    // Check which movies the user has watched
    const watchedMovies = await ctx.db
      .query('watchedMovies')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const watchedMovieIds = new Set(watchedMovies.map((w) => w.movieId))

    const progress = listMovies.map((movie) => ({
      movie,
      watched: movie ? watchedMovieIds.has(movie._id) : false,
    }))

    return {
      list,
      progress,
      totalMovies: list.movies.length,
      watchedCount: progress.filter((p) => p.watched).length,
    }
  },
})
