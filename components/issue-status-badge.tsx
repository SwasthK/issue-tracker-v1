import { Badge } from "@/components/ui/badge"
import { issueStatusLabels, type IssueStatus } from "@/lib/validations"

const variants: Record<IssueStatus, "default" | "secondary" | "outline"> = {
  OPEN: "default",
  IN_PROGRESS: "secondary",
  CLOSED: "outline",
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return <Badge variant={variants[status]}>{issueStatusLabels[status]}</Badge>
}
