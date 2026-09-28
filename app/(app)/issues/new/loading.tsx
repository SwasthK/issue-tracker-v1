import { IssueFormSkeleton, PageHeaderSkeleton } from "@/components/skeletons"

export default function NewIssueLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action={false} />
      <IssueFormSkeleton />
    </div>
  )
}
