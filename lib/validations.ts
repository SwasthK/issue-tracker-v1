import { z } from "zod"

export const issueStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().trim().min(2, "Organization name is required"),
})

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const requestPasswordResetSchema = z.object({
  email: z.email("Enter a valid email"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const createOrgSchema = z.object({
  organizationName: z.string().trim().min(2, "Organization name is required"),
})

export const memberSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "member"]).default("member"),
})

export const issueSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().default(""),
  status: issueStatusSchema.default("OPEN"),
  assigneeId: z
    .string()
    .optional()
    .transform((value) =>
      !value || value === "unassigned" ? null : value
    ),
})

export const commentSchema = z.object({
  issueId: z.string().min(1),
  body: z.string().trim().min(1, "Comment cannot be empty"),
})

export type IssueStatus = z.infer<typeof issueStatusSchema>

export const issueStatusLabels: Record<IssueStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
}

