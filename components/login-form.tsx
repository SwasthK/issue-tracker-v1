"use client"

import Link from "next/link"
import { useActionState } from "react"

import { loginAction } from "@/app/actions/auth"
import { AuthCard } from "@/components/auth-card"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ActionState } from "@/lib/actions"

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    loginAction,
    null
  )

  return (
    <AuthCard
      title="Sign in"
      description="Members added by an admin can sign in here."
    >
      <form action={formAction} className="space-y-4">
        <FormAlert error={state?.error} />
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>
        <SubmitButton className="w-full" pendingLabel="Signing in...">
          Sign in
        </SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          First admin?{" "}
          <Link href="/register" className="underline">
            Create an organization
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
