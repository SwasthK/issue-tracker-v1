import { IssueFormSkeleton, PageHeaderSkeleton } from "@/components/skeletons"

export default function EditIssueLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action={false} />
      <IssueFormSkeleton />
    </div>
  )
}
