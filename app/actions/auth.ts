"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { actionError, invalidInput } from "@/lib/actions"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uniqueSlug } from "@/lib/utils"
import {
  createOrgSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "@/lib/validations"

import type { ActionState } from "@/lib/actions"

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organizationName: formData.get("organizationName"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
    })

    const org = await auth.api.createOrganization({
      body: {
        name: parsed.data.organizationName,
        slug: uniqueSlug(parsed.data.organizationName),
        userId: result.user.id,
      },
    })

    if (org?.id) {
      await prisma.session.updateMany({
        where: { userId: result.user.id },
        data: { activeOrganizationId: org.id },
      })
    }
  } catch (error) {
    return actionError(error)
  }

  redirect("/dashboard")
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    })
  } catch (error) {
    return actionError(error)
  }

  redirect("/dashboard")
}

export async function createOrgAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createOrgSchema.safeParse({
    organizationName: formData.get("organizationName"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    const org = await auth.api.createOrganization({
      body: {
        name: parsed.data.organizationName,
        slug: uniqueSlug(parsed.data.organizationName),
      },
      headers: await headers(),
    })

    if (org?.id) {
      await auth.api.setActiveOrganization({
        body: { organizationId: org.id },
        headers: await headers(),
      })
    }
  } catch (error) {
    return actionError(error)
  }

  redirect("/dashboard")
}

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/reset-password`,
      },
    })
  } catch {
    // Always look successful so emails cannot be enumerated.
  }

  return {
    message: "If that email exists, we sent a reset link.",
  }
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return invalidInput(parsed)
  }

  try {
    await auth.api.resetPassword({
      body: {
        token: parsed.data.token,
        newPassword: parsed.data.password,
      },
    })
  } catch (error) {
    return actionError(error)
  }

  redirect("/login")
}
