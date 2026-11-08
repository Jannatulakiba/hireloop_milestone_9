"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HomeIcon, LayoutDashboardIcon, LogOutIcon, Plus } from "lucide-react"

import logo from "@app/images/logo.png"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { authClient, signOut } from "@/lib/auth-client"

const mainitemTypes = {
  seeker: [],
  recruiter: [],
  admin: [],
}





export function DashboardSidebar() {

  const { data: session, isPending } = authClient.useSession()

  const role: unknown = session?.user?.role || "seeker"
 


  
 
  const handleSignOut = async () => {
    await signOut()
  
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/"
          aria-label="hireloop — home"
          className="flex items-center rounded-md px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={logo}
            alt="hireloop"
            width={154}
            height={44}
            className="h-7 w-auto"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <SidebarGroup>
  <SidebarGroupLabel>
    Application
    </SidebarGroupLabel>
           <SidebarGroupAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarGroupAction>

</SidebarGroup></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
              //   mainitemTypes[role].map((item) => (
              //   <SidebarMenuItem key={item.id}>
              //     <SidebarMenuButton
                   
              //       render={<Link href={item.href} />}
              //     >
              //       <item.icon />
              //       <span>{item.label}</span>
              //     </SidebarMenuButton>
              //   </SidebarMenuItem>
              // ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {isPending ? "…" : displayName}
            </p>
            <p className="truncate text-xs capitalize text-sidebar-foreground/70">
              {role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOutIcon />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
