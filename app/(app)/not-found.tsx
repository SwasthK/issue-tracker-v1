import Link from "next/link"

import { NotFoundState } from "@/components/not-found-state"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <NotFoundState
      className="min-h-[60vh]"
      description="This issue or page does not exist, or you may not have access to it."
    >
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/dashboard" />}
      >
        Dashboard
      </Button>
      <Button nativeButton={false} render={<Link href="/issues" />}>
        Back to issues
      </Button>
    </NotFoundState>
  )
}
