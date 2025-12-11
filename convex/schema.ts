import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { authTables } from '@convex-dev/auth/server'

const applicationTables = {
  // Store movie information from TMDB
  movies: defineTable({
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
    tmdbId: v.number(),
  }).index('by_tmdb_id', ['tmdbId']),

  // User's watchlist
  watchlist: defineTable({
    userId: v.id('users'),
    movieId: v.id('movies'),
    addedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_movie', ['userId', 'movieId']),

  // User's watched movies (allows multiple entries for rewatching)
  watchedMovies: defineTable({
    userId: v.id('users'),
    movieId: v.id('movies'),
    watchedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_movie', ['userId', 'movieId']),

  // Actors that have been researched or have been nominated to an academy award
  actors: defineTable({
    tmdbId: v.number(),
    picture_path: v.optional(v.string()),
    name: v.string(),
  }).index('by_tmdb_id', ['tmdbId']),

  // Editions of the oscars
  oscarEditions: defineTable({
    number: v.number(),
    year: v.number(),
    date: v.number(),
  }).index('by_number', ['number']),

  // All categories ever created for the oscars
  oscarCategories: defineTable({
    name: v.object({
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    order: v.number(),
  }),

  oscarNomination: defineTable({
    movieId: v.id('movies'), //exchange
    editionId: v.id('oscarEditions'), //omit
    categoryId: v.id('oscarCategories'), //exchange
    actorId: v.optional(v.id('actors')), //exchange
    country: v.optional(v.string()),
    winner: v.optional(v.boolean()),
    song: v.optional(v.string()),
    url: v.optional(v.string()),
    nominee: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
    character: v.optional(
      v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
    ),
  }).index('by_edition', ['editionId']),
}

export default defineSchema({
  ...authTables,
  ...applicationTables,
})
