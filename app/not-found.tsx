import Link from "next/link"

import { Centered } from "@/components/centered"
import { NotFoundState } from "@/components/not-found-state"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <Centered>
      <NotFoundState
        className="max-w-md"
        description="The page you are looking for does not exist or may have been moved."
      >
        <Button nativeButton={false} render={<Link href="/" />}>
          Go home
        </Button>
      </NotFoundState>
    </Centered>
  )
}
