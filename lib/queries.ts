import { prisma } from "@/lib/prisma"

export async function getOrgMembers(orgId: string) {
  return prisma.member.findMany({
    where: { organizationId: orgId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  })
}

export async function getOrgMemberOptions(orgId: string) {
  const members = await getOrgMembers(orgId)

  return members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
  }))
}
