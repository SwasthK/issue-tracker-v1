"use client"

import { useActionState, useState } from "react"

import { addMemberAction } from "@/app/actions/members"
import { FormAlert } from "@/components/form-alert"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { ActionState } from "@/lib/actions"

export function AddMemberDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add member</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            They will log in with this email and password.
          </DialogDescription>
        </DialogHeader>
        <AddMemberForm
          key={open ? "open" : "closed"}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function AddMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await addMemberAction(prev, formData)
      if (!result?.error) {
        onSuccess()
      }
      return result
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-6">
      <FormAlert error={state?.error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Temporary password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Select name="role" defaultValue="member">
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <SubmitButton pendingLabel="Adding...">Add member</SubmitButton>
      </DialogFooter>
    </form>
  )
}
