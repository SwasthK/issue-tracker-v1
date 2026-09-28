"use client"

import { useActionState } from "react"

import { createOrgAction } from "@/app/actions/auth"
import { AuthCard } from "@/components/auth-card"
import { Centered } from "@/components/centered"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ActionState } from "@/lib/actions"

export default function OnboardingPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createOrgAction,
    null
  )

  return (
    <Centered>
      <AuthCard
        title="Create your organization"
        description="You need an organization before you can manage issues."
      >
        <form action={formAction} className="space-y-4">
          <FormAlert error={state?.error} />
          <Field>
            <FieldLabel htmlFor="organizationName">Organization name</FieldLabel>
            <Input id="organizationName" name="organizationName" required />
          </Field>
          <SubmitButton className="w-full" pendingLabel="Creating...">
            Continue
          </SubmitButton>
        </form>
      </AuthCard>
    </Centered>
  )
}
