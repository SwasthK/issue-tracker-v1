import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin, organization } from "better-auth/plugins"

import {
  sendMemberWelcomeEmail,
  sendOrgInviteEmail,
  sendPasswordResetEmail,
} from "@/lib/email"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        to: user.email,
        url,
      })
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const membership = await prisma.member.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: "asc" },
          })

          return {
            data: {
              ...session,
              activeOrganizationId: membership?.organizationId,
            },
          }
        },
      },
    },
  },
  plugins: [
    admin(),
    organization({
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/login`
        void sendOrgInviteEmail({
          to: data.email,
          invitedBy: data.inviter.user.name,
          organizationName: data.organization.name,
          inviteLink,
        })
      },
      organizationHooks: {
        afterCreateOrganization: async ({ user }) => {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" },
          })
        },
        afterAddMember: async ({ user, organization }) => {
          void sendMemberWelcomeEmail({
            to: user.email,
            name: user.name,
            organizationName: organization.name,
          })
        },
      },
    }),
    nextCookies(),
  ],
})
