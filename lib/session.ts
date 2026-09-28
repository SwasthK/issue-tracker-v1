import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireSession() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function requireOrg() {
  const session = await requireSession()
  const orgId = session.session.activeOrganizationId

  if (!orgId) {
    redirect("/onboarding")
  }

  const member = await prisma.member.findFirst({
    where: {
      organizationId: orgId,
      userId: session.user.id,
    },
  })

  if (!member) {
    redirect("/onboarding")
  }

  return {
    user: session.user,
    session: session.session,
    orgId,
    member,
  }
}

export function isOrgManager(role: string) {
  return role === "owner" || role === "admin"
}
