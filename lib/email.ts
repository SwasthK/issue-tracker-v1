import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM =
  process.env.RESEND_FROM ?? "Issue Tracker <onboarding@resend.dev>"

function appUrl() {
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
}

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set")
    return
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    text,
  })

  if (error) {
    console.error("Resend error:", error.message)
  }
}

export function sendMemberWelcomeEmail({
  to,
  name,
  organizationName,
}: {
  to: string
  name: string
  organizationName: string
}) {
  const loginUrl = `${appUrl()}/login`

  return sendEmail({
    to,
    subject: `You've been added to ${organizationName}`,
    text: `Hi ${name},\n\nYou've been added to ${organizationName} on Issue Tracker.\n\nSign in at ${loginUrl} with the password your admin shared with you.\n`,
  })
}

export function sendPasswordResetEmail({
  to,
  url,
}: {
  to: string
  url: string
}) {
  return sendEmail({
    to,
    subject: "Reset your Issue Tracker password",
    text: `Reset your password using this link:\n${url}\n\nIf you did not request this, you can ignore this email.\n`,
  })
}

export function sendOrgInviteEmail({
  to,
  invitedBy,
  organizationName,
  inviteLink,
}: {
  to: string
  invitedBy: string
  organizationName: string
  inviteLink: string
}) {
  return sendEmail({
    to,
    subject: `Join ${organizationName} on Issue Tracker`,
    text: `${invitedBy} invited you to ${organizationName}.\n\nAccept the invite:\n${inviteLink}\n`,
  })
}
