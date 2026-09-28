import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

import { deleteIssueAction } from "@/app/actions/issues"
import { CommentForm } from "@/components/comment-form"
import { IssueStatusBadge } from "@/components/issue-status-badge"
import { PageHeader } from "@/components/page-header"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/session"

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { orgId } = await requireOrg()
  const { id } = await params
  const issue = await prisma.issue.findFirst({
    where: { id, organizationId: orgId },
    include: {
      creator: { select: { name: true } },
      assignee: { select: { name: true } },
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!issue) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={issue.title}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <IssueStatusBadge status={issue.status} />
            <span>Created by {issue.creator.name}</span>
            <span>Assigned to {issue.assignee?.name ?? "Unassigned"}</span>
          </div>
        }
      >
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/issues/${issue.id}/edit`} />}
        >
          Edit
        </Button>
        <form action={deleteIssueAction}>
          <input type="hidden" name="issueId" value={issue.id} />
          <SubmitButton variant="destructive" pendingLabel="Deleting...">
            Delete
          </SubmitButton>
        </form>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm">
          {issue.description || "No description provided."}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>
            {issue.comments.length}{" "}
            {issue.comments.length === 1 ? "comment" : "comments"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {issue.comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{comment.author.name}</span>{" "}
                <span className="text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </p>
              <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
              <Separator />
            </div>
          ))}
          <CommentForm issueId={issue.id} />
        </CardContent>
      </Card>
    </div>
  )
}
