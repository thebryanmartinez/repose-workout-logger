import { z } from 'zod'

import { authStrings } from '#/modules/auth/localization'

export const registerSchema = z.object({
  name: z.string().min(1, authStrings.validation.nameRequired),
  username: z
    .string()
    .trim()
    .min(3, authStrings.validation.usernameMinLength)
    .regex(/^[a-z0-9_]+$/, authStrings.validation.usernamePattern),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
