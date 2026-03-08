import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
  }).index("by_username", ["username"]),
  workouts: defineTable({
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
  }).index("by_user", ["userId"]),
})
