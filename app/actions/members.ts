"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { actionError, invalidInput, type ActionState } from "@/lib/actions"
import { auth } from "@/lib/auth"
import { isOrgManager, requireOrg } from "@/lib/session"
import { memberSchema } from "@/lib/validations"

export async function addMemberAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { orgId, member } = await requireOrg()

  if (!isOrgManager(member.role)) {
    return { error: "Only org admins can add members" }
  }

  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "member",
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    const created = await auth.api.createUser({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: "user",
      },
      headers: await headers(),
    })

    await auth.api.addMember({
      body: {
        userId: created.user.id,
        role: parsed.data.role,
        organizationId: orgId,
      },
      headers: await headers(),
    })
  } catch (error) {
    return actionError(error)
  }

  revalidatePath("/members")
  return null
}

export async function removeMemberAction(formData: FormData) {
  const { orgId, member } = await requireOrg()

  if (!isOrgManager(member.role)) {
    redirect("/members")
  }

  const memberIdOrEmail = String(formData.get("memberIdOrEmail") ?? "")

  if (!memberIdOrEmail) {
    redirect("/members")
  }

  await auth.api.removeMember({
    body: {
      memberIdOrEmail,
      organizationId: orgId,
    },
    headers: await headers(),
  })

  revalidatePath("/members")
}
