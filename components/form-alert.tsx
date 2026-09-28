import { Alert, AlertDescription } from "@/components/ui/alert"

export function FormAlert({
  error,
  message,
}: {
  error?: string
  message?: string
}) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (message) {
    return (
      <Alert>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  return null
}
