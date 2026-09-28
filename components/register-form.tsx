"use client"

import Link from "next/link"
import { useActionState } from "react"

import { registerAction } from "@/app/actions/auth"
import { AuthCard } from "@/components/auth-card"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ActionState } from "@/lib/actions"

export function RegisterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    registerAction,
    null
  )

  return (
    <AuthCard
      title="Create admin account"
      description="Register first, create your organization, then add members."
    >
      <form action={formAction} className="space-y-4">
        <FormAlert error={state?.error} />
        <Field>
          <FieldLabel htmlFor="name">Your name</FieldLabel>
          <Input id="name" name="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="organizationName">Organization</FieldLabel>
          <Input
            id="organizationName"
            name="organizationName"
            required
            placeholder="Acme Inc"
          />
        </Field>
        <SubmitButton className="w-full" pendingLabel="Creating...">
          Create organization
        </SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
