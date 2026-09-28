"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { invalidInput, type ActionState } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/session"
import { commentSchema, issueSchema } from "@/lib/validations"

function revalidateIssues(issueId?: string) {
  revalidatePath("/dashboard")
  revalidatePath("/issues")
  if (issueId) {
    revalidatePath(`/issues/${issueId}`)
  }
}

export async function createIssueAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, orgId } = await requireOrg()
  const parsed = issueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status") || "OPEN",
    assigneeId: formData.get("assigneeId"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  const issue = await prisma.issue.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      assigneeId: parsed.data.assigneeId,
      creatorId: user.id,
      organizationId: orgId,
    },
  })

  revalidateIssues(issue.id)
  redirect(`/issues/${issue.id}`)
}

export async function updateIssueAction(
  issueId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { orgId } = await requireOrg()
  const parsed = issueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status") || "OPEN",
    assigneeId: formData.get("assigneeId"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  const existing = await prisma.issue.findFirst({
    where: { id: issueId, organizationId: orgId },
    select: { id: true },
  })

  if (!existing) {
    return { error: "Issue not found" }
  }

  await prisma.issue.update({
    where: { id: issueId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      assigneeId: parsed.data.assigneeId,
    },
  })

  revalidateIssues(issueId)
  redirect(`/issues/${issueId}`)
}

export async function deleteIssueAction(formData: FormData) {
  const { orgId } = await requireOrg()
  const issueId = String(formData.get("issueId") ?? "")

  if (!issueId) {
    redirect("/issues")
  }

  await prisma.issue.deleteMany({
    where: { id: issueId, organizationId: orgId },
  })

  revalidateIssues()
  redirect("/issues")
}

export async function addCommentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, orgId } = await requireOrg()
  const parsed = commentSchema.safeParse({
    issueId: formData.get("issueId"),
    body: formData.get("body"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  const issue = await prisma.issue.findFirst({
    where: { id: parsed.data.issueId, organizationId: orgId },
    select: { id: true },
  })

  if (!issue) {
    return { error: "Issue not found" }
  }

  await prisma.comment.create({
    data: {
      body: parsed.data.body,
      issueId: issue.id,
      authorId: user.id,
    },
  })

  revalidatePath(`/issues/${issue.id}`)
  return null
}
