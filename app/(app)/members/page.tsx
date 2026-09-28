import { redirect } from "next/navigation"

import { removeMemberAction } from "@/app/actions/members"
import { AddMemberDialog } from "@/components/add-member-dialog"
import { PageHeader } from "@/components/page-header"
import { SubmitButton } from "@/components/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrgMembers } from "@/lib/queries"
import { isOrgManager, requireOrg } from "@/lib/session"

export default async function MembersPage() {
  const { user, orgId, member } = await requireOrg()

  if (!isOrgManager(member.role)) {
    redirect("/dashboard")
  }

  const members = await getOrgMembers(orgId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Create member accounts, then they can sign in and work on issues."
      >
        <AddMemberDialog />
      </PageHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.user.name}</TableCell>
              <TableCell>{item.user.email}</TableCell>
              <TableCell className="capitalize">{item.role}</TableCell>
              <TableCell className="text-right">
                {item.user.id !== user.id && item.role !== "owner" ? (
                  <form action={removeMemberAction}>
                    <input
                      type="hidden"
                      name="memberIdOrEmail"
                      value={item.user.email}
                    />
                    <SubmitButton
                      variant="ghost"
                      size="sm"
                      pendingLabel="Removing..."
                    >
                      Remove
                    </SubmitButton>
                  </form>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
