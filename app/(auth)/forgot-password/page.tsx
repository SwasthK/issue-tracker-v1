"use client"

import Link from "next/link"
import { useActionState } from "react"

import { requestPasswordResetAction } from "@/app/actions/auth"
import { AuthCard } from "@/components/auth-card"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ActionState } from "@/lib/actions"

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    requestPasswordResetAction,
    null
  )

  return (
    <AuthCard
      title="Forgot password"
      description="We will email a reset link if the account exists."
    >
      <form action={formAction} className="space-y-4">
        <FormAlert error={state?.error} message={state?.message} />
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>
        <SubmitButton className="w-full" pendingLabel="Sending...">
          Send reset link
        </SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
