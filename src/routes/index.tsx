import { getStoredUser } from '#/modules/auth/hooks/useAuth'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!getStoredUser()) {
      navigate({ to: '/login', replace: true })
    }
  }, [])

  return <main className=""></main>
}
