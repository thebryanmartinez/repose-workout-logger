import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { registerSchema, type RegisterFormValues } from '#/modules/auth/forms/register.schema'
import { useAuth, getStoredUser } from '#/modules/auth/hooks/useAuth'
import { authStrings } from '#/modules/auth/localization'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '#/modules/shared/ui/card'
import { Field, FieldGroup, FieldLabel, FieldError } from '#/modules/shared/ui/field'
import { Input } from '#/modules/shared/ui/input'
import { Button } from '#/modules/shared/ui/button'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()

  useEffect(() => {
    if (getStoredUser()) {
      navigate({ to: '/', replace: true })
    }
  }, [])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: 'var(--sea-ink)' }}>{authStrings.register.title}</CardTitle>
          <CardDescription>{authStrings.register.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((values) => registerUser(values, setError))} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{authStrings.register.nameLabel}</FieldLabel>
                <Input id="name" autoComplete="name" {...register('name')} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">{authStrings.register.usernameLabel}</FieldLabel>
                <Input id="username" autoComplete="username" {...register('username')} />
                <FieldError errors={[errors.username]} />
              </Field>
            </FieldGroup>
            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting} style={{ background: 'var(--lagoon)' }}>
              {isSubmitting ? authStrings.register.submitLoading : authStrings.register.submitIdle}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {authStrings.register.hasAccount}
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--lagoon-deep)' }}>
            {authStrings.register.signInLink}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
