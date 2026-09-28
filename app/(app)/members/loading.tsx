import { PageHeaderSkeleton, TableSkeleton } from "@/components/skeletons"

export default function MembersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton headers={["Name", "Email", "Role", ""]} rows={4} />
    </div>
  )
}
