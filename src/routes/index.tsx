import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('username')) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return <main className=""></main>
}
