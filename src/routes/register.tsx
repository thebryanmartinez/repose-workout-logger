import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useConvex } from 'convex/react'

import { api } from '../../convex/_generated/api'
import { saveUser } from '#/modules/auth/hooks/useAuth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '#/modules/shared/ui/card'
import { Field, FieldGroup, FieldLabel, FieldError } from '#/modules/shared/ui/field'
import { Input } from '#/modules/shared/ui/input'
import { Button } from '#/modules/shared/ui/button'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, underscore'),
})

type FormValues = z.infer<typeof schema>

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && localStorage.getItem('username')) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const convex = useConvex()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit({ name, username }: FormValues) {
    const existing = await convex.query(api.users.getByUsername, { username })
    if (existing) {
      setError('username', { message: 'Username already taken' })
      return
    }
    await convex.mutation(api.users.create, { name, username })
    saveUser(username)
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: 'var(--sea-ink)' }}>Create an account</CardTitle>
          <CardDescription>Start tracking your workouts with Repose</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" autoComplete="name" {...register('name')} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" autoComplete="username" {...register('username')} />
                <FieldError errors={[errors.username]} />
              </Field>
            </FieldGroup>
            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting} style={{ background: 'var(--lagoon)' }}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?&nbsp;
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--lagoon-deep)' }}>
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
