"use client"

import Link from "next/link"
import { Suspense, useActionState } from "react"
import { useSearchParams } from "next/navigation"

import { resetPasswordAction } from "@/app/actions/auth"
import { AuthCard } from "@/components/auth-card"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ActionState } from "@/lib/actions"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [state, formAction] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    null
  )

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        This reset link is missing a token.{" "}
        <Link href="/forgot-password" className="underline">
          Request a new one
        </Link>
        .
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <FormAlert error={state?.error} />
      <Field>
        <FieldLabel htmlFor="password">New password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
        />
      </Field>
      <SubmitButton className="w-full" pendingLabel="Saving...">
        Reset password
      </SubmitButton>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="Choose a new password for your account."
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  )
}
