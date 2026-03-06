import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
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
