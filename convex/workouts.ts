import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('workouts')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()
  },
})

export const getById = query({
  args: { id: v.id('workouts') },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id)
  },
})

export const create = mutation({
  args: {
    userId: v.string(),
    routine: v.object({
      name: v.string(),
      exercises: v.array(
        v.object({
          name: v.string(),
          sets: v.array(v.object({ reps: v.string(), weight: v.string() })),
        })
      ),
    }),
  },
  handler: async (ctx, { userId, routine }) => {
    return ctx.db.insert('workouts', { userId, routine })
  },
})

export const update = mutation({
  args: {
    id: v.id('workouts'),
    routine: v.object({
      name: v.string(),
      exercises: v.array(
        v.object({
          name: v.string(),
          sets: v.array(v.object({ reps: v.string(), weight: v.string() })),
        })
      ),
    }),
  },
  handler: async (ctx, { id, routine }) => {
    await ctx.db.patch(id, { routine })
  },
})

export const remove = mutation({
  args: { id: v.id('workouts') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
