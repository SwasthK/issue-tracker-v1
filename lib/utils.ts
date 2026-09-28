export { cn } from "cn"

export function uniqueSlug(value: string) {
  const slug =
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "org"
  const suffix = Math.random().toString(36).slice(2, 6)

  return `${slug}-${suffix}`
}
