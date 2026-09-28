import { notFound } from "next/navigation"

import { IssueForm } from "@/components/issue-form"
import { PageHeader } from "@/components/page-header"
import { prisma } from "@/lib/prisma"
import { getOrgMemberOptions } from "@/lib/queries"
import { requireOrg } from "@/lib/session"

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { orgId } = await requireOrg()
  const { id } = await params
  const [issue, members] = await Promise.all([
    prisma.issue.findFirst({
      where: { id, organizationId: orgId },
    }),
    getOrgMemberOptions(orgId),
  ])

  if (!issue) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit issue" description={issue.title} />
      <IssueForm
        members={members}
        issue={{
          id: issue.id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
          assigneeId: issue.assigneeId,
        }}
      />
    </div>
  )
}
