"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BriefcaseIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import logo from "@app/images/logo.png"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient, signOut, type Role } from "@/lib/auth-client"

type MainMenuItem = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

// Role onujayi menu items — naye page add korle ekhane link set kore din.
const mainItemTypes: Record<Role, MainMenuItem[]> = {
  seeker: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/seeker",
      icon: LayoutDashboardIcon,
    },
    {
      id: "find-jobs",
      label: "Find Jobs",
      href: "/dashboard/seeker/jobs",
      icon: SearchIcon,
    },
    {
      id: "applications",
      label: "Applications",
      href: "/dashboard/seeker/applications",
      icon: FileTextIcon,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/seeker/settings",
      icon: SettingsIcon,
    },
  ],
  recruiter: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/recruiter",
      icon: LayoutDashboardIcon,
    },
     {
      id: "users",
      label: "Manage Users",
      href: "/dashboard/recruiter/users",
      icon: UsersIcon,
    },
     {
      id: "company",
      label: "Manage Company",
      href: "/dashboard/recruiter/company",
      icon: BriefcaseIcon,
    },
    {
      id: "manage-jobs",
      label: "Manage Jobs",
      href: "/dashboard/recruiter/jobs",
      icon: BriefcaseIcon,
    },
    {
      id: "payments",
      label: "Payments",
      href: "/dashboard/recruiter/payments",
      icon: FileTextIcon,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/recruiter/settings",
      icon: SettingsIcon,
    },
  ],
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboardIcon,
    },
    {
      id: "manage-users",
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: UsersIcon,
    },
    {
      id: "manage-jobs",
      label: "Manage Jobs",
      href: "/dashboard/admin/jobs",
      icon: BriefcaseIcon,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/admin/settings",
      icon: SettingsIcon,
    },
  ],
}

function isRole(value: unknown): value is Role {
  return value === "seeker" || value === "recruiter" || value === "admin"
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const sessionRole: unknown = session?.user?.role
  const pathRole = pathname.split("/")[2]
  const role: Role = isRole(sessionRole)
    ? sessionRole
    : isRole(pathRole)
      ? pathRole
      : "seeker"

  const user = session?.user
  const displayName = user?.name || user?.email || "Account"
  const initial = displayName.trim().charAt(0).toUpperCase() || "H"

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Sidebar className="top-16 h-[calc(100svh-4rem)] md:top-[74px] md:h-[calc(100svh-74px)]">
      <SidebarHeader className="gap-3 p-3">
        {/* Logo */}
        <Link
          href="/"
          aria-label="hireloop — home"
          className="flex items-center px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={logo}
            alt="hireloop"
            width={154}
            height={44}
            className="h-7 w-auto"
          />
        </Link>

        {/* User card */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-sm font-semibold text-white"
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
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
              className="shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOutIcon />
            </Button>
          </div>
          <span className="mt-2.5 inline-flex w-fit items-center rounded-full border border-brand/40 bg-brand/15 px-2.5 py-0.5 text-[11px] font-medium text-brand dark:text-brand-light">
            Premium account
          </span>
        </div>
      </SidebarHeader>

      {/* Menu — role onujayi items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItemTypes[role].map((item) => {
                const active = pathname === item.href

                return (
                  <SidebarMenuItem key={item.id}>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                      />
                    )}
                    <SidebarMenuButton
                      isActive={active}
                      aria-current={active ? "page" : undefined}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-sidebar-foreground/80"
        >
          <LogOutIcon />
          Sign out
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
