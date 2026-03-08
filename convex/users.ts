import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
  },
})

export const create = mutation({
  args: { name: v.string(), username: v.string() },
  handler: async (ctx, { name, username }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
    if (existing) {
      throw new Error(`Username "${username}" is already taken`)
    }
    return await ctx.db.insert('users', { name, username })
  },
})
