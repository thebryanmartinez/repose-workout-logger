import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useConvex } from 'convex/react'

import { api } from '../../convex/_generated/api'
import { saveUser } from '#/modules/auth/hooks/useAuth'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '#/modules/shared/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '#/modules/shared/ui/field'
import { Input } from '#/modules/shared/ui/input'
import { Button } from '#/modules/shared/ui/button'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
})

type FormValues = z.infer<typeof schema>

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && localStorage.getItem('username')) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const convex = useConvex()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit({ username }: FormValues) {
    const user = await convex.query(api.users.getByUsername, { username })
    if (user) {
      saveUser(username)
      navigate({ to: '/' })
    } else {
      setError('username', {
        message: 'Username not found. Please check and try again.',
      })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: 'var(--sea-ink)' }}>
            Welcome back
          </CardTitle>
          <CardDescription>Sign in to your Repose account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  autoComplete="username"
                  {...register('username')}
                />
                <FieldError errors={[errors.username]} />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isSubmitting}
              style={{ background: 'var(--lagoon)' }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          No account?&nbsp;
          <Link
            to="/register"
            className="font-medium hover:underline"
            style={{ color: 'var(--lagoon-deep)' }}
          >
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
