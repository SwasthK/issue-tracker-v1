export type ActionState = {
  error?: string
  message?: string
} | null

export function actionError(error: unknown): ActionState {
  if (error && typeof error === "object" && "message" in error) {
    return { error: String((error as { message: string }).message) }
  }

  return { error: "Something went wrong" }
}

export function invalidInput(parsed: {
  error: { issues: { message: string }[] }
}): ActionState {
  return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
}
