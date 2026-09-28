import Link from "next/link"

import { IssueCharts } from "@/components/issue-charts"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getOrgMembers } from "@/lib/queries"
import { requireOrg } from "@/lib/session"
import { issueStatusLabels } from "@/lib/validations"

export default async function DashboardPage() {
  const { orgId } = await requireOrg()
  const [total, grouped, assigneeGroups, members] = await Promise.all([
    prisma.issue.count({ where: { organizationId: orgId } }),
    prisma.issue.groupBy({
      by: ["status"],
      where: { organizationId: orgId },
      _count: { _all: true },
    }),
    prisma.issue.groupBy({
      by: ["assigneeId"],
      where: { organizationId: orgId },
      _count: { _all: true },
    }),
    getOrgMembers(orgId),
  ])

  const counts = {
    OPEN: 0,
    IN_PROGRESS: 0,
    CLOSED: 0,
    ...Object.fromEntries(
      grouped.map((item) => [item.status, item._count._all])
    ),
  }

  const statusData = (["OPEN", "IN_PROGRESS", "CLOSED"] as const).map(
    (status) => ({
      status,
      count: counts[status],
    })
  )

  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  const assignmentData = assigneeGroups.map((item, index) => {
    const member = members.find((entry) => entry.user.id === item.assigneeId)

    return {
      key: item.assigneeId ?? "unassigned",
      label: member?.user.name ?? "Unassigned",
      count: item._count._all,
      fill: chartColors[index % chartColors.length],
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Issue counts for your organization"
      >
        <Button nativeButton={false} render={<Link href="/issues/new" />}>
          New issue
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        {statusData.map((item) => (
          <Card key={item.status}>
            <CardHeader>
              <CardDescription>{issueStatusLabels[item.status]}</CardDescription>
              <CardTitle className="text-3xl">{item.count}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                <Link href={`/issues?status=${item.status}`}>View issues</Link>
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <IssueCharts statusData={statusData} assignmentData={assignmentData} />
    </div>
  )
}
