import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, type LoginFormValues } from '#/modules/auth/forms/login.schema'
import { useAuth, getStoredUser } from '#/modules/auth/hooks/useAuth'
import { authStrings } from '#/modules/auth/localization'
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

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

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
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: 'var(--sea-ink)' }}>
            {authStrings.login.title}
          </CardTitle>
          <CardDescription>{authStrings.login.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((values) => login(values, setError))} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">{authStrings.login.usernameLabel}</FieldLabel>
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
              {isSubmitting ? authStrings.login.submitLoading : authStrings.login.submitIdle}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {authStrings.login.noAccount}
          <Link
            to="/register"
            className="font-medium hover:underline"
            style={{ color: 'var(--lagoon-deep)' }}
          >
            {authStrings.login.registerLink}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
