import { ConvexError, v } from 'convex/values'

import { api, internal } from './_generated/api'
import { Id } from './_generated/dataModel'
import { action, internalQuery, mutation, query } from './_generated/server'
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
      watched: v.optional(v.boolean()),
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

        const { _id, character, nominee, country, song, url, winner } = nomination
        return {
          _id,
          character,
          nominee,
          country,
          song,
          url,
          winner,
          movie: {
            _id: movie._id,
            title: {
              pt_BR: movie.title.pt_BR,
              en_US: movie.title.en_US,
            },
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
export const getWatchedMoviesFromEdition = query({
  args: { editionId: v.optional(v.id('oscarEditions')) },
  returns: v.array(
    v.object({
      _id: v.id('watchedMovies'),
      title: v.object({
        original: v.string(),
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      posterPath: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      watchedAt: v.number(),
      tmdbId: v.number(),
      movieId: v.id('movies'),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    const latestEdition = await ctx.db.query('oscarEditions').order('desc').first()

    const nominations = await ctx.db
      .query('oscarNomination')
      .withIndex('by_edition', (q) => q.eq('editionId', args.editionId ?? latestEdition!._id))
      .collect()

    const nominatedMovies = Array.from(new Set(nominations.map((n) => n.movieId)))

    const watchedMovies = await ctx.db
      .query('watchedMovies')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()

    const watchedNominatedMovies = watchedMovies.filter((wm) =>
      nominatedMovies.includes(wm.movieId),
    )
    const movies = await Promise.all(
      watchedNominatedMovies.map(async (item) => {
        const movie = await ctx.db.get(item.movieId)
        return {
          _id: item._id,
          title: movie!.title,
          posterPath: movie!.posterPath,
          tmdbId: movie!.tmdbId,
          watchedAt: item.watchedAt,
          movieId: movie!._id,
        }
      }),
    )

    return movies
  },
})

export const getMovies = query({
  args: { editionId: v.optional(v.id('oscarEditions')) },
  returns: v.array(
    v.object({
      _id: v.id('movies'),
      tmdbId: v.number(),
      title: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      posterPath: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      watched: v.optional(v.boolean()),
      nominationCount: v.number(),
      friends_who_watched: v.array(
        v.object({
          _id: v.id('users'),
          name: v.optional(v.string()),
          image: v.optional(v.string()),
        }),
      ),
    }),
  ),

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const latestEdition = await ctx.db.query('oscarEditions').order('desc').first()

    const nominations = await ctx.db
      .query('oscarNomination')
      .withIndex('by_edition', (q) => q.eq('editionId', args.editionId ?? latestEdition?._id!))
      .collect()

    const movieIds = new Map(
      Array.from(new Set(nominations.map((n) => n.movieId))).map((id) => [
        id,
        nominations.filter((n) => n.movieId === id).length,
      ]),
    )

    const movies: {
      _id: Id<'movies'>
      tmdbId: number
      title: { pt_BR: string; en_US: string }
      posterPath: { pt_BR: string; en_US: string }
      watched: boolean | undefined
      nominationCount: number
      friends_who_watched: { _id: Id<'users'>; name?: string; image?: string }[]
    }[] = []

    // Preload friends and their watched nominated movies to avoid per-movie queries
    const friendsWhoWatchedByMovie = new Map<
      Id<'movies'>,
      { _id: Id<'users'>; name?: string; image?: string }[]
    >()

    if (userId) {
      const friendLinks = await ctx.db
        .query('friends')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect()

      const nominatedSet = new Set(movieIds.keys())

      for (const link of friendLinks) {
        const friendUser = await ctx.db.get(link.friendId)
        if (!friendUser) continue

        const friendWatched = await ctx.db
          .query('watchedMovies')
          .withIndex('by_user', (q) => q.eq('userId', link.friendId))
          .collect()

        for (const wm of friendWatched) {
          if (!nominatedSet.has(wm.movieId as Id<'movies'>)) continue

          const arr = friendsWhoWatchedByMovie.get(wm.movieId as Id<'movies'>) ?? []
          arr.push({ _id: friendUser._id, name: friendUser.name, image: friendUser.image })
          friendsWhoWatchedByMovie.set(wm.movieId as Id<'movies'>, arr)
        }
      }
    }

    for (const [movieId, count] of movieIds) {
      const movie = await ctx.db.get(movieId)
      if (!movie) continue

      let watched: boolean | undefined = undefined
      if (userId) {
        const watchedItem = await ctx.db
          .query('watchedMovies')
          .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', movieId))
          .first()
        watched = !!watchedItem
      }

      movies.push({
        _id: movie._id,
        tmdbId: movie.tmdbId,
        title: {
          pt_BR: movie.title.pt_BR,
          en_US: movie.title.en_US,
        },
        posterPath: {
          pt_BR: movie.posterPath.pt_BR,
          en_US: movie.posterPath.en_US,
        },
        watched,
        nominationCount: count,
        friends_who_watched: friendsWhoWatchedByMovie.get(movieId) ?? [],
      })
    }

    return movies
  },
})

export const getNominations = query({
  args: { editionId: v.optional(v.id('oscarEditions')) },
  returns: v.array(
    v.object({
      category: v.object({
        _id: v.id('oscarCategories'),
        name: v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
        order: v.number(),
      }),
      type: v.union(
        v.literal('person'),
        v.literal('song'),
        v.literal('movie'),
        v.literal('picture'),
      ),
      nominations: v.array(
        v.object({
          nominationId: v.id('oscarNomination'),
          movieId: v.id('movies'),
          tmdbId: v.number(),
          title: v.object({
            pt_BR: v.string(),
            en_US: v.string(),
          }),
          posterPath: v.object({
            pt_BR: v.string(),
            en_US: v.string(),
          }),
          description: v.optional(
            v.object({
              pt_BR: v.string(),
              en_US: v.string(),
            }),
          ),
          winner: v.optional(v.boolean()),
          watched: v.optional(v.boolean()),
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const latestEdition = await ctx.db.query('oscarEditions').order('desc').first()

    const nominations = await ctx.db
      .query('oscarNomination')
      .withIndex('by_edition', (q) => q.eq('editionId', args.editionId ?? latestEdition?._id!))
      .collect()

    const categoryMap = new Map<
      Id<'oscarCategories'>,
      {
        category: {
          _id: Id<'oscarCategories'>
          name: {
            pt_BR: string
            en_US: string
          }
          order: number
        }
        type: 'person' | 'song' | 'movie' | 'picture'
        nominations: {
          nominationId: Id<'oscarNomination'>
          movieId: Id<'movies'>
          tmdbId: number
          title: {
            pt_BR: string
            en_US: string
          }
          posterPath: {
            pt_BR: string
            en_US: string
          }
          description?: {
            pt_BR: string
            en_US: string
          }
          winner?: boolean
          watched?: boolean
        }[]
      }
    >()

    for (const nomination of nominations) {
      if (!categoryMap.has(nomination.categoryId)) {
        const category = await ctx.db
          .query('oscarCategories')
          .withIndex('by_id', (q) => q.eq('_id', nomination.categoryId))
          .unique()

        const isActorCategory = !!nomination.actorId
        const isSongCategory = !!nomination.song
        const isPictureCategory = category?.name.en_US.includes('Picture')

        const type: 'person' | 'song' | 'movie' | 'picture' = isActorCategory
          ? 'person'
          : isSongCategory
            ? 'song'
            : isPictureCategory
              ? 'picture'
              : 'movie'

        categoryMap.set(nomination.categoryId, {
          category: {
            _id: category!._id,
            name: category!.name,
            order: category!.order,
          },
          type,
          nominations: [],
        })
      }
      const movie = await ctx.db.get(nomination.movieId)
      const actor = nomination.actorId ? await ctx.db.get(nomination.actorId) : null
      const movieWatch = userId
        ? await ctx.db
            .query('watchedMovies')
            .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', movie!._id))
            .first()
        : undefined

      const oldValue = categoryMap.get(nomination.categoryId)

      const isActorCategory = !!nomination.actorId
      const isSongCategory = !!nomination.song

      const title =
        isActorCategory && actor
          ? { pt_BR: actor.name, en_US: actor.name }
          : isSongCategory
            ? { pt_BR: nomination.song!, en_US: nomination.song! }
            : {
                pt_BR: movie!.title.pt_BR,
                en_US: movie!.title.en_US,
              }
      const description =
        isActorCategory || isSongCategory
          ? {
              en_US: movie!.title.en_US,
              pt_BR: movie!.title.pt_BR,
            }
          : undefined

      const posterPath =
        isActorCategory && actor?.picture_path
          ? { pt_BR: actor.picture_path, en_US: actor.picture_path }
          : {
              pt_BR: movie!.posterPath.pt_BR,
              en_US: movie!.posterPath.en_US,
            }

      categoryMap.set(nomination.categoryId, {
        category: oldValue!.category,
        type: oldValue!.type,
        nominations: [
          ...(oldValue?.nominations || []),
          {
            nominationId: nomination._id,
            movieId: movie!._id,
            tmdbId: movie!.tmdbId,
            title,
            description,
            posterPath,
            winner: nomination.winner,
            watched: !!movieWatch,
          },
        ],
      })
    }

    const data = Array.from(categoryMap.values()).sort(
      (a, b) => a.category.order - b.category.order,
    )
    return data
  },
})

export const getMovieNominations = internalQuery({
  args: {
    movieId: v.id('movies'),
  },
  returns: v.array(
    v.object({
      nominationId: v.id('oscarNomination'),
      categoryId: v.id('oscarCategories'),
      categoryName: v.object({
        pt_BR: v.string(),
        en_US: v.string(),
      }),
      winner: v.optional(v.boolean()),
      actorId: v.optional(v.id('actors')),
    }),
  ),

  handler: async (ctx, args) => {
    const nomination = await ctx.db
      .query('oscarNomination')
      .withIndex('by_movie', (q) => q.eq('movieId', args.movieId))
      .collect()

    const enrichedNominations = await Promise.all(
      nomination.map(async (nom) => {
        const category = await ctx.db.get(nom.categoryId)
        return {
          nominationId: nom._id,
          categoryId: nom.categoryId,
          categoryName: {
            pt_BR: category!.name.pt_BR,
            en_US: category!.name.en_US,
          },
          winner: nom.winner,
          actorId: nom.actorId,
        }
      }),
    )

    return enrichedNominations
  },
})

export const getMovieFriends = internalQuery({
  args: {
    movieId: v.id('movies'),
  },
  returns: v.array(
    v.object({
      _id: v.id('users'),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      username: v.optional(v.string()),
    }),
  ),

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const friends = await ctx.db
      .query('friends')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const enrichedFriends = await Promise.all(
      friends.map(async (fr) => {
        const watched = await ctx.db
          .query('watchedMovies')
          .withIndex('by_user_and_movie', (q) =>
            q.eq('userId', fr.friendId).eq('movieId', args.movieId),
          )
          .first()

        if (watched) {
          const friend = await ctx.db.get(fr.friendId)

          if (friend)
            return {
              _id: friend._id,
              name: friend.name,
              image: friend.image,
              username: friend.username,
            }
        }
      }),
    )

    return enrichedFriends.filter((e) => e !== undefined)
  },
})

export const getMovieLatestWatch = internalQuery({
  args: {
    movieId: v.id('movies'),
  },
  returns: v.union(v.id('watchedMovies'), v.null()),

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const latestWatch = await ctx.db
      .query('watchedMovies')
      .withIndex('by_user_and_movie', (q) => q.eq('userId', userId).eq('movieId', args.movieId))
      .order('desc')
      .first()
    if (!latestWatch) return null

    return latestWatch._id
  },
})

export const getMovieDetail = query({
  args: {
    tmdbId: v.number(),
  },
  returns: v.object({
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
    tmdbId: v.number(),
    brazil: v.optional(v.boolean()),
    latestWatch: v.optional(v.id('watchedMovies')),
    nominations: v.array(
      v.object({
        nominationId: v.id('oscarNomination'),
        categoryId: v.id('oscarCategories'),
        categoryName: v.object({
          pt_BR: v.string(),
          en_US: v.string(),
        }),
        winner: v.optional(v.boolean()),
        actorId: v.optional(v.id('actors')),
      }),
    ),
    friends: v.array(
      v.object({
        _id: v.id('users'),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        username: v.optional(v.string()),
      }),
    ),
  }),
  // cast: v.array(
  //   v.object({
  //     id: v.number(),
  //     name: v.string(),
  //     character: v.optional(v.string()),
  //     profile_path: v.optional(v.string()),
  //     order: v.number(),
  //   }),
  // ),

  // providers: v.object({
  //   BR: v.optional(
  //     v.object({
  //       flatrate: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //       rent: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //       buy: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //     }),
  //   ),
  //   US: v.optional(
  //     v.object({
  //       flatrate: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //       rent: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //       buy: v.optional(
  //         v.array(
  //           v.object({
  //             provider_id: v.number(),
  //             provider_name: v.string(),
  //             logo_path: v.string(),
  //           }),
  //         ),
  //       ),
  //     }),
  //   ),
  // }),

  handler: async (ctx, args): Promise<any> => {
    const movie = await ctx.runQuery(api.movies.getMovie, { tmdbId: args.tmdbId })

    if (!movie) throw new ConvexError('Movie not found')

    const nominations = await ctx.runQuery(internal.oscars.getMovieNominations, {
      movieId: movie?._id,
    })

    const friends = await ctx.runQuery(internal.oscars.getMovieFriends, {
      movieId: movie?._id,
    })

    const latestWatch = await ctx.runQuery(internal.oscars.getMovieLatestWatch, {
      movieId: movie?._id,
    })
    return {
      ...movie,
      latestWatch: latestWatch ? latestWatch : undefined,
      nominations,
      friends,
    }

    // 2. Fetch cast from TMDB
    // let cast: {
    //   id: number
    //   name: string
    //   character?: string
    //   profile_path?: string
    //   order: number
    // }[] = []

    // try {
    //   const castUrl = `https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits?language=en-US`
    //   const headers = {
    //     Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    //     accept: 'application/json',
    //   }

    //   const castResponse = await fetch(castUrl, { headers })
    //   if (castResponse.ok) {
    //     const castData: { cast?: any[] } = await castResponse.json()
    //     cast = (castData.cast || []).slice(0, 20).map((actor, index) => ({
    //       id: actor.id,
    //       name: actor.name,
    //       character: actor.character || undefined,
    //       profile_path: actor.profile_path || undefined,
    //       order: index,
    //     }))
    //   }
    // } catch (error) {
    //   console.error('Error fetching cast from TMDB:', error)
    //   // Continue without cast if fetch fails
    // }

    // // 5. Fetch watch providers from TMDB
    // let providers: { BR?: any; US?: any } = {}
    // try {
    //   const providersUrl = `https://api.themoviedb.org/3/movie/${movie.tmdbId}/watch/providers?language=en-US`
    //   const headers = {
    //     Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    //     accept: 'application/json',
    //   }

    //   const providersResponse = await fetch(providersUrl, { headers })
    //   if (providersResponse.ok) {
    //     const providersData: { results?: Record<string, any> } = await providersResponse.json()

    //     if (providersData.results) {
    //       // Extract Brazil (BR) providers
    //       if (providersData.results.BR) {
    //         const brData = providersData.results.BR
    //         providers.BR = {
    //           flatrate: brData.flatrate
    //             ? brData.flatrate.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //           rent: brData.rent
    //             ? brData.rent.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //           buy: brData.buy
    //             ? brData.buy.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //         }
    //       }

    //       // Extract US providers
    //       if (providersData.results.US) {
    //         const usData = providersData.results.US
    //         providers.US = {
    //           flatrate: usData.flatrate
    //             ? usData.flatrate.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //           rent: usData.rent
    //             ? usData.rent.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //           buy: usData.buy
    //             ? usData.buy.map((p: any) => ({
    //                 provider_id: p.provider_id,
    //                 provider_name: p.provider_name,
    //                 logo_path: p.logo_path,
    //               }))
    //             : undefined,
    //         }
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error fetching providers from TMDB:', error)
    //   // Continue without providers if fetch fails
    // }
  },
})
