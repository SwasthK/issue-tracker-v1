import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { hashPassword } from "better-auth/crypto"

import { PrismaClient } from "../generated/prisma/client"

const PASSWORD = "Password123!"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
})

async function createLoginUser({
  name,
  email,
  role,
}: {
  name: string
  email: string
  role: "admin" | "user"
}) {
  const userId = crypto.randomUUID()
  const password = await hashPassword(PASSWORD)

  const user = await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      role,
    },
  })

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password,
    },
  })

  return user
}

async function main() {
  const ava = await createLoginUser({
    name: "Ava Chen",
    email: "julia.r@example.org",
    role: "admin",
  })
  const noah = await createLoginUser({
    name: "Noah Patel",
    email: "marco.r@example.org",
    role: "user",
  })
  const maya = await createLoginUser({
    name: "Maya Singh",
    email: "emma.t@example.net",
    role: "user",
  })
  const leo = await createLoginUser({
    name: "Leo Wright",
    email: "james.b@example.com",
    role: "user",
  })
  const priya = await createLoginUser({
    name: "Priya Nair",
    email: "oscar.d@example.net",
    role: "user",
  })

  const now = new Date()
  const org = await prisma.organization.create({
    data: {
      id: crypto.randomUUID(),
      name: "Acme Engineering",
      slug: "acme-engineering",
      createdAt: now,
    },
  })

  await prisma.member.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: ava.id,
        role: "owner",
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: noah.id,
        role: "admin",
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: maya.id,
        role: "member",
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: leo.id,
        role: "member",
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: priya.id,
        role: "member",
        createdAt: now,
      },
    ],
  })

  const loginRedirect = await prisma.issue.create({
    data: {
      title: "Fix login redirect after member sign-in",
      description:
        "Members sometimes land on the login page again after a successful sign-in. Session cookie looks stale.",
      status: "IN_PROGRESS",
      organizationId: org.id,
      creatorId: ava.id,
      assigneeId: maya.id,
    },
  })

  const emptyDashboard = await prisma.issue.create({
    data: {
      title: "Empty dashboard should explain next steps",
      description:
        "When an org has no issues, the charts are blank. Add a short empty state that points to New issue.",
      status: "OPEN",
      organizationId: org.id,
      creatorId: ava.id,
      assigneeId: leo.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Allow filtering issues by assignee",
      description: "Dashboard links to status filters. We also need a filter for my issues.",
      status: "OPEN",
      organizationId: org.id,
      creatorId: noah.id,
      assigneeId: priya.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Member welcome email never arrives",
      description:
        "Resend test sender only delivers to the account inbox. Document that and switch FROM for production.",
      status: "OPEN",
      organizationId: org.id,
      creatorId: noah.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Triage backlog from last sprint",
      description: "Close duplicates and re-assign anything still sitting unowned.",
      status: "IN_PROGRESS",
      organizationId: org.id,
      creatorId: ava.id,
      assigneeId: noah.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Add comment timestamps on issue detail",
      description: "Relative time is fine. Keep it next to the author name.",
      status: "CLOSED",
      organizationId: org.id,
      creatorId: maya.id,
      assigneeId: maya.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Delete unused shadcn components from scaffold",
      description: "The starter copied every widget. Keep only what the tracker uses.",
      status: "CLOSED",
      organizationId: org.id,
      creatorId: leo.id,
      assigneeId: leo.id,
    },
  })

  await prisma.issue.create({
    data: {
      title: "Write Vercel deploy notes in README",
      description: "Cover DATABASE_URL at build time, migrate deploy, and BETTER_AUTH_URL.",
      status: "CLOSED",
      organizationId: org.id,
      creatorId: ava.id,
      assigneeId: priya.id,
    },
  })

  await prisma.comment.createMany({
    data: [
      {
        issueId: loginRedirect.id,
        authorId: ava.id,
        body: "Reproduced on Chrome after a hard refresh. Proxy is sending people to /login when the cookie is missing.",
      },
      {
        issueId: loginRedirect.id,
        authorId: maya.id,
        body: "Looking at the session hook next. Might be a race on first request after signup.",
      },
      {
        issueId: emptyDashboard.id,
        authorId: leo.id,
        body: "I can add copy under the charts. Want a screenshot of the empty pie too?",
      },
    ],
  })

  console.log("Seeded Acme Engineering")
  console.log("Password for every account: Password123!")
  console.log("  julia.r@example.org  (owner)")
  console.log("  marco.r@example.org (admin)")
  console.log("  emma.t@example.net  (member)")
  console.log("  james.b@example.com  (member)")
  console.log("  oscar.d@example.net  (member)")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
