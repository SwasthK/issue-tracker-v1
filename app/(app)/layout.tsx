import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { prisma } from "@/lib/prisma"
import { isOrgManager, requireOrg } from "@/lib/session"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, orgId, member } = await requireOrg()
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  })

  return (
    <SidebarProvider>
      <AppSidebar
        orgName={organization?.name ?? "Organization"}
        userName={user.name}
        userEmail={user.email}
        role={member.role}
        canManageMembers={isOrgManager(member.role)}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">Issue Tracker</span>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
