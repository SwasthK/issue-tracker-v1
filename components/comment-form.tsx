"use client"

import { useActionState } from "react"

import { addCommentAction } from "@/app/actions/issues"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

import type { ActionState } from "@/lib/actions"

export function CommentForm({ issueId }: { issueId: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    addCommentAction,
    null
  )

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="issueId" value={issueId} />
      <FormAlert error={state?.error} />
      <Field>
        <FieldLabel htmlFor="body">Add a comment</FieldLabel>
        <Textarea id="body" name="body" required placeholder="Write a comment" />
      </Field>
      <SubmitButton pendingLabel="Posting...">Post comment</SubmitButton>
    </form>
  )
}
