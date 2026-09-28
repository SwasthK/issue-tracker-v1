"use client"

import { useActionState } from "react"

import { createIssueAction, updateIssueAction } from "@/app/actions/issues"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { issueStatusLabels, type IssueStatus } from "@/lib/validations"

import type { ActionState } from "@/lib/actions"

type MemberOption = {
  id: string
  name: string
}

type IssueFormProps = {
  members: MemberOption[]
  issue?: {
    id: string
    title: string
    description: string
    status: IssueStatus
    assigneeId: string | null
  }
}

export function IssueForm({ members, issue }: IssueFormProps) {
  const action = issue
    ? updateIssueAction.bind(null, issue.id)
    : createIssueAction
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      <FormAlert error={state?.error} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            required
            defaultValue={issue?.title}
            placeholder="Short summary"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={issue?.description}
            placeholder="What needs to be done?"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={issue?.status ?? "OPEN"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(issueStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="assigneeId">Assignee</FieldLabel>
            <Select
              name="assigneeId"
              defaultValue={issue?.assigneeId ?? "unassigned"}
              items={{
                unassigned: "Unassigned",
                ...Object.fromEntries(
                  members.map((member) => [member.id, member.name])
                ),
              }}
            >
              <SelectTrigger id="assigneeId" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </FieldGroup>
      <SubmitButton pendingLabel="Saving...">
        {issue ? "Save changes" : "Create issue"}
      </SubmitButton>
    </form>
  )
}
