import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { IssueStatusBadge } from "@/components/issue-status-badge"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/session"
import {
  issueStatusLabels,
  issueStatusSchema,
  type IssueStatus,
} from "@/lib/validations"

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { orgId } = await requireOrg()
  const params = await searchParams
  const parsedStatus = issueStatusSchema.safeParse(params.status)
  const status = parsedStatus.success ? parsedStatus.data : undefined

  const issues = await prisma.issue.findMany({
    where: {
      organizationId: orgId,
      ...(status ? { status } : {}),
    },
    include: {
      assignee: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issues"
        description={status ? issueStatusLabels[status] : "All statuses"}
      >
        <Button
          variant={!status ? "default" : "outline"}
          size="sm"
          nativeButton={false}
          render={<Link href="/issues" />}
        >
          All
        </Button>
        {(Object.keys(issueStatusLabels) as IssueStatus[]).map((value) => (
          <Button
            key={value}
            variant={status === value ? "default" : "outline"}
            size="sm"
            nativeButton={false}
            render={<Link href={`/issues?status=${value}`} />}
          >
            {issueStatusLabels[value]}
          </Button>
        ))}
        <Button nativeButton={false} render={<Link href="/issues/new" />}>
          New issue
        </Button>
      </PageHeader>

      {issues.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No issues yet</EmptyTitle>
            <EmptyDescription>
              Create the first issue for this organization.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <Link
                    href={`/issues/${issue.id}`}
                    className="font-medium hover:underline"
                  >
                    {issue.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <IssueStatusBadge status={issue.status} />
                </TableCell>
                <TableCell>{issue.assignee?.name ?? "Unassigned"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(issue.updatedAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
