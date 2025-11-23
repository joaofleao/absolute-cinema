import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { authTables } from '@convex-dev/auth/server'

const applicationTables = {
  // Store movie information from TMDB
  movies: defineTable({
    tmdbId: v.number(),
    title: v.string(),
    posterPath: v.optional(v.string()),
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
