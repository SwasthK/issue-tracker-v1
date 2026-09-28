import { IssueForm } from "@/components/issue-form"
import { PageHeader } from "@/components/page-header"
import { getOrgMemberOptions } from "@/lib/queries"
import { requireOrg } from "@/lib/session"

export default async function NewIssuePage() {
  const { orgId } = await requireOrg()
  const members = await getOrgMemberOptions(orgId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="New issue"
        description="Create a tracked item for the team."
      />
      <IssueForm members={members} />
    </div>
  )
}
