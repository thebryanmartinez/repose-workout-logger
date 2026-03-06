import { z } from 'zod'

import { authStrings } from '#/modules/auth/localization'

export const loginSchema = z.object({
  username: z.string().min(1, authStrings.validation.usernameRequired),
})

export type LoginFormValues = z.infer<typeof loginSchema>
