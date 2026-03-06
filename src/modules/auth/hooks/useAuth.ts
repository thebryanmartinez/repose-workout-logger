import { createClientOnlyFn } from '@tanstack/react-start'

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
