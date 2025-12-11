import { ConvexError, v } from 'convex/values'

import { api, internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { action, internalAction, internalMutation, mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

interface TMDBMovieSearchResult {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

interface TMDBMovie {
  title: string
  poster_path: string
  original_title: string

  backdrop_path: string
  imdb_id: null
  original_language: string
  overview: string
  release_date: string
  runtime: number
  status: string
  tagline: string
  vote_average: number
}

export const searchMovies = action({
  args: {
    query: v.string(),
    language: v.optional(v.string()),
    page: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      id: v.number(),
      title: v.string(),
      poster_path: v.optional(v.string()),
      release_date: v.string(),
      vote_average: v.number(),
      original_language: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(args.query)}&page=${encodeURIComponent(args.page ?? 1)}&language=${args.language ?? 'en-US'}`

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      accept: 'application/json',
    }

    const response = await fetch(url, { headers })

    if (!response.ok) throw new ConvexError('Failed to search movies')

    const data: { results: TMDBMovieSearchResult[] } = await response.json()

    const sortedByPopularity = data.results.sort((a, b) => b.popularity - a.popularity)

    const cleaned = sortedByPopularity.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path === null ? undefined : movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      original_language: movie.original_language,
    }))

    return cleaned
  },
})

export const fetchMovie = internalAction({
  args: { tmdbId: v.number() },
  returns: v.object({
    tmdbId: v.number(),
    title: v.object({
      original: v.string(),
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    posterPath: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    backdropPath: v.optional(v.string()),
    imdbId: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    overview: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    status: v.optional(v.string()),
    tagline: v.optional(v.string()),
    voteAverage: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const urlEN = `https://api.themoviedb.org/3/movie/${args.tmdbId}?language=en-US`
    const urlPT = `https://api.themoviedb.org/3/movie/${args.tmdbId}?language=pt-BR`

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      accept: 'application/json',
    }

    const responseEN = await fetch(urlEN, { headers })
    const responsePT = await fetch(urlPT, { headers })

    if (!responseEN.ok || !responsePT.ok) throw new ConvexError('Failed to fetch movie details')

    const dataEN: TMDBMovie = await responseEN.json()
    const dataPT: TMDBMovie = await responsePT.json()

    return {
      tmdbId: args.tmdbId,
      title: {
        original: dataEN.original_title,
        en_US: dataEN.title,
        pt_BR: dataPT.title,
      },
      posterPath: {
        en_US: dataEN.poster_path,
        pt_BR: dataPT.poster_path,
      },
      backdropPath: dataEN.backdrop_path,
      imdbId: dataEN.imdb_id ?? undefined,
      originalLanguage: dataEN.original_language,
      overview: dataEN.overview,
      releaseDate: dataEN.release_date,
      runtime: dataEN.runtime,
      status: dataEN.status,
      tagline: dataEN.tagline,
      voteAverage: dataEN.vote_average,
    }
  },
})

export const insertMovie = internalMutation({
  args: {
    title: v.object({
      original: v.string(),
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    posterPath: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    backdropPath: v.optional(v.string()),
    imdbId: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    overview: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    status: v.optional(v.string()),
    tagline: v.optional(v.string()),
    voteAverage: v.optional(v.number()),
    tmdbId: v.optional(v.number()),
  },
  returns: v.id('movies'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('movies', args)
  },
})

export const getMovie = mutation({
  args: {
    tmdbId: v.number(),
  },
  returns: v.union(
    v.object({
      _id: v.id('movies'),
      _creationTime: v.number(),
      title: v.object({
        original: v.string(),
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      posterPath: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      overview: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      voteAverage: v.optional(v.number()),
      tmdbId: v.optional(v.number()),
    }),
    v.null(),
  ),

  handler: async (ctx, args) => {
    const existingMovie = await ctx.db
      .query('movies')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingMovie) return existingMovie
  },
})

export const getOrCreateMovie = action({
  args: { tmdbId: v.number() },
  returns: v.id('movies'),
  handler: async (ctx, args): Promise<Id<'movies'>> => {
    const existingMovie = await ctx.runMutation(api.movies.getMovie, {
      tmdbId: args.tmdbId,
    })

    if (existingMovie) return existingMovie._id

    const movieDetails = await ctx.runAction(internal.movies.fetchMovie, {
      tmdbId: args.tmdbId,
    })

    const newMovieId = await ctx.runMutation(internal.movies.insertMovie, movieDetails)

    return newMovieId
  },
})

export const addToWatchlist = mutation({
  args: { movieId: v.id('movies') },
  returns: v.id('watchlist'),

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

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

export const removeFromWatchlist = mutation({
  args: { movieId: v.id('movies') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    const watchlistItem = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

export const removeFromWatchedMovies = mutation({
  args: { watchId: v.id('watchedMovies') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    const watchlistItem = await ctx.db
      .query('watchedMovies')
      .withIndex('by_id', (q) => q.eq('_id', args.watchId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

export const markAsWatched = mutation({
  args: { movieId: v.id('movies'), watchedAt: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('Not authenticated')

    await ctx.db.insert('watchedMovies', {
      userId,
      movieId: args.movieId,
      watchedAt: args.watchedAt,
    })

    const watchlistItem = await ctx.db
      .query('watchlist')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .unique()

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id)
    }
  },
})

export const getUserWatchlist = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('movies'),
      _creationTime: v.number(),
      title: v.object({
        original: v.string(),
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      posterPath: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      overview: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      voteAverage: v.optional(v.number()),
      tmdbId: v.optional(v.number()),
      addedAt: v.number(),
    }),
  ),
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

export const getUserWatchedMovies = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('movies'),
      _creationTime: v.number(),
      title: v.object({
        original: v.string(),
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      posterPath: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      overview: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      voteAverage: v.optional(v.number()),
      tmdbId: v.optional(v.number()),
      watchedAt: v.number(),
      watchId: v.id('watchedMovies'),
    }),
  ),
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

export const isInWatchlist = query({
  args: { movieId: v.id('movies') },
  returns: v.boolean(),
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

export const hasWatchedMovie = query({
  args: { movieId: v.id('movies') },
  returns: v.boolean(),
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
