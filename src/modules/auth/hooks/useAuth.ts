import { createClientOnlyFn } from '@tanstack/react-start'
import { useConvex } from 'convex/react'
import { useNavigate } from '@tanstack/react-router'
import type { UseFormSetError } from 'react-hook-form'

import { api } from '../../../../convex/_generated/api'
import type { LoginFormValues } from '#/modules/auth/forms/login.schema'
import type { RegisterFormValues } from '#/modules/auth/forms/register.schema'
import { authStrings } from '#/modules/auth/localization'

const KEY = 'username'

export const getStoredUser = createClientOnlyFn((): string | null => {
  return localStorage.getItem(KEY)
})

export const saveUser = createClientOnlyFn((username: string): void => {
  localStorage.setItem(KEY, username)
})

export const clearUser = createClientOnlyFn((): void => {
  localStorage.removeItem(KEY)
})

export function useAuth() {
  const convex = useConvex()
  const navigate = useNavigate()

  async function login(
    { username }: LoginFormValues,
    setError: UseFormSetError<LoginFormValues>,
  ) {
    const user = await convex.query(api.users.getByUsername, { username })
    if (user) {
      saveUser(username)
      navigate({ to: '/' })
    } else {
      setError('username', {
        message: authStrings.errors.usernameNotFound,
      })
    }
  }

  async function register(
    { name, username }: RegisterFormValues,
    setError: UseFormSetError<RegisterFormValues>,
  ) {
    const existing = await convex.query(api.users.getByUsername, { username })
    if (existing) {
      setError('username', { message: authStrings.errors.usernameTaken })
      return
    }
    await convex.mutation(api.users.create, { name, username })
    saveUser(username)
    navigate({ to: '/' })
  }

  function logout() {
    clearUser()
    navigate({ to: '/login' })
  }

  return { login, register, logout }
}
