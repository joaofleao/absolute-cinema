import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { authTables } from '@convex-dev/auth/server'

const applicationTables = {
  // Store movie information from TMDB
  movies: defineTable({
    tmdbId: v.number(),
    title: v.object({
      original: v.string(),
      pt_BR: v.string(),
      en_US: v.string(),
    }),
    posterPath: v.object({
      pt_BR: v.optional(v.string()),
      en_US: v.optional(v.string()),
    }),
    releaseDate: v.string(),
    voteAverage: v.number(),
    originalLanguage: v.string(),
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
    categories: v.array(v.string()), // Array of category IDs
    date: v.string(),
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
    movieId: v.id('movies'),
    editionId: v.id('oscarEditions'),
    category: v.id('oscarCategories'),
    winner: v.optional(v.boolean()),

    // For overall nominations
    nominee: v.optional(
      v.object({
        pt_BR: v.optional(v.string()),
        en_US: v.optional(v.string()),
      }),
    ),

    // For leading/supportive actor/actress nominations
    actorId: v.optional(v.id('actors')),
    character: v.optional(
      v.object({
        pt_BR: v.optional(v.string()),
        en_US: v.optional(v.string()),
      }),
    ),

    // For country nominations
    country: v.optional(
      v.object({
        pt_BR: v.optional(v.string()),
        en_US: v.optional(v.string()),
      }),
    ),

    // For song nominations
    song: v.optional(v.string()),
    url: v.optional(v.string()),
  }),

  // Movie lists that users can join
  movieLists: defineTable({
    name: v.string(),
    description: v.string(),
    createdBy: v.id('users'),
    movies: v.array(v.number()), // Array of TMDB IDs
    isPublic: v.boolean(),
  })
    .index('by_creator', ['createdBy'])
    .index('by_public', ['isPublic']),

  // User enrollments in movie lists
  movieListEnrollments: defineTable({
    userId: v.id('users'),
    movieListId: v.id('movieLists'),
    enrolledAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_list', ['movieListId'])
    .index('by_user_and_list', ['userId', 'movieListId']),
}

export default defineSchema({
  ...authTables,
  ...applicationTables,
})
