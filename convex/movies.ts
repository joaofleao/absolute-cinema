import { ConvexError, v } from 'convex/values'

import { api, internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { action, internalAction, internalMutation, mutation, query } from './_generated/server'
import { countries, languages } from './constants'
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
  origin_country: string[]
}

export const searchMovies = action({
  args: {
    query: v.string(),
    language: v.optional(v.union(v.literal('en_US'), v.literal('pt_BR'))),
    page: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      id: v.number(),
      title: v.string(),
      poster_path: v.optional(v.string()),
      release_date: v.optional(v.string()),
      vote_average: v.optional(v.number()),
      original_language: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const language = args.language === 'pt_BR' ? 'pt-BR' : 'en-US'
    const url = `https://api.themoviedb.org/3/search/movie?query=${args.query}&language=${language}`

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      accept: 'application/json',
    }

    const response = await fetch(url, { headers })

    if (!response.ok) throw new ConvexError('Failed to search movies')

    const data: { results: TMDBMovieSearchResult[] } = await response.json()

    const sortedByPopularity = data.results.sort((a, b) => b.popularity - a.popularity)

    const enrichedData = sortedByPopularity.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path === null ? undefined : movie.poster_path,
      release_date: movie.release_date === null ? undefined : movie.release_date,
      vote_average: movie.vote_average === null ? undefined : movie.vote_average,
      original_language:
        movie.original_language === null
          ? undefined
          : languages[movie.original_language][args.language ?? 'en_US'],
    }))

    return enrichedData
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
    plot: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    status: v.optional(v.string()),
    tagline: v.optional(v.string()),
    voteAverage: v.optional(v.number()),
    originCountry: v.optional(v.array(v.string())),
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

        pt_BR: dataPT.title ?? dataEN.title,
      },
      posterPath: {
        en_US: dataEN.poster_path,
        pt_BR: dataPT.poster_path ?? dataEN.poster_path,
      },
      backdropPath: dataEN.backdrop_path ?? undefined,
      imdbId: dataEN.imdb_id ?? undefined,
      originalLanguage: dataEN.original_language,
      plot: dataEN.overview
        ? {
            en_US: dataEN.overview,
            pt_BR: dataPT.overview ?? dataEN.overview,
          }
        : undefined,
      releaseDate: dataEN.release_date,
      runtime: dataEN.runtime,
      status: dataEN.status,
      tagline: dataEN.tagline,
      voteAverage: dataEN.vote_average,
      originCountry: dataEN.origin_country,
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
    plot: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    status: v.optional(v.string()),
    tagline: v.optional(v.string()),
    voteAverage: v.optional(v.number()),
    tmdbId: v.number(),
    originCountry: v.array(v.string()),
  },
  returns: v.id('movies'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('movies', args)
  },
})

export const getMovie = query({
  args: {
    tmdbId: v.number(),
    language: v.optional(v.union(v.literal('en_US'), v.literal('pt_BR'))),
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
      posterPath: v.string(),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      plot: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      voteAverage: v.optional(v.number()),
      tmdbId: v.number(),
      originCountry: v.optional(
        v.array(
          v.object({
            name: v.string(),
            code: v.string(),
            url: v.string(),
          }),
        ),
      ),
    }),
    v.null(),
  ),

  handler: async (ctx, args) => {
    const existingMovie = await ctx.db
      .query('movies')
      .withIndex('by_tmdb_id', (q) => q.eq('tmdbId', args.tmdbId))
      .unique()

    if (existingMovie)
      return {
        ...existingMovie,
        posterPath: existingMovie.posterPath[args.language ?? 'en_US'],
        plot: existingMovie.plot ? existingMovie.plot[args.language ?? 'en_US'] : undefined,
        originalLanguage: existingMovie.originalLanguage
          ? languages[existingMovie.originalLanguage]?.[args.language ?? 'en_US']
          : undefined,
        originCountry: existingMovie.originCountry
          ? existingMovie.originCountry.map((code) => ({
              code,
              name: countries[code]?.[args.language ?? 'en_US'] || code,
              url: `https://hatscripts.github.io/circle-flags/flags/${code}.svg`,
            }))
          : undefined,
      }

    return null
  },
})

export const getOrCreateMovie = action({
  args: { tmdbId: v.number() },
  returns: v.id('movies'),
  handler: async (ctx, args): Promise<Id<'movies'>> => {
    const existingMovie = await ctx.runQuery(api.movies.getMovie, {
      tmdbId: args.tmdbId,
    })

    if (existingMovie) {
      return existingMovie._id
    }

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
  args: {
    language: v.optional(v.union(v.literal('en_US'), v.literal('pt_BR'))),
  },
  returns: v.array(
    v.object({
      _id: v.id('movies'),
      _creationTime: v.number(),
      title: v.string(),
      posterPath: v.string(),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      plot: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      voteAverage: v.optional(v.number()),
      originCountry: v.optional(v.array(v.string())),
      tmdbId: v.number(),
      addedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const watchlistItems = await ctx.db
      .query('watchlist')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const movies = await Promise.all(
      watchlistItems.map(async (item) => {
        const movie = await ctx.db.get(item.movieId)
        if (!movie) return
        return {
          ...movie,
          addedAt: item.addedAt,
          title: movie.title[args.language ?? 'en_US'],
          posterPath: movie.posterPath[args.language ?? 'en_US'],
          plot: movie.plot?.[args.language ?? 'en_US'],
          originalLanguage: movie.originalLanguage
            ? languages[movie.originalLanguage][args.language ?? 'en_US']
            : undefined,
        }
      }),
    )

    return movies.filter((e) => e !== undefined)
  },
})

export const getUserWatchedMovies = query({
  args: {
    language: v.optional(v.union(v.literal('en_US'), v.literal('pt_BR'))),
  },
  returns: v.array(
    v.object({
      _id: v.id('movies'),
      _creationTime: v.number(),
      title: v.string(),
      posterPath: v.string(),
      backdropPath: v.optional(v.string()),
      imdbId: v.optional(v.string()),
      originalLanguage: v.optional(v.string()),
      plot: v.optional(v.string()),
      releaseDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
      status: v.optional(v.string()),
      tagline: v.optional(v.string()),
      originCountry: v.optional(v.array(v.string())),
      voteAverage: v.optional(v.number()),
      tmdbId: v.number(),
      watchedAt: v.number(),
      watchId: v.id('watchedMovies'),
    }),
  ),
  handler: async (ctx, args) => {
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
        if (!movie) return null
        return {
          ...movie,
          watchedAt: item.watchedAt,
          watchId: item._id,
          title: movie.title[args.language ?? 'en_US'],
          posterPath: movie.posterPath[args.language ?? 'en_US'],
          plot: movie.plot?.[args.language ?? 'en_US'],
          originalLanguage: movie.originalLanguage
            ? languages[movie.originalLanguage][args.language ?? 'en_US']
            : undefined,
        }
      }),
    )

    return movies.filter((e) => e !== null)
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
