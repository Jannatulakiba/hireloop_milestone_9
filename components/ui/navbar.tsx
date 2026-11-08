"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

import ctaBg from "@app/images/cta-bg.png"
import logo from "@app/images/logo.png"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

const mobileLinkClassName =
  "rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none"

function Navbar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header
      data-slot="navbar"
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10 bg-surface/85 backdrop-blur-xl",
        className
      )}
    >
      {/* Ambient glow from @app/images */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={ctaBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/70 to-surface/95" />
      </div>

      <div className="relative mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-4 md:h-[74px] md:gap-6 md:px-6">
        <Link
          href="/"
          aria-label="hireloop — home"
          className="flex shrink-0 items-center focus-visible:outline-none"
        >
          <Image
            src={logo}
            alt="hireloop"
            width={154}
            height={44}
            loading="eager"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}

          <Separator orientation="vertical" className="h-5 bg-white/15" />

          <Link
            href="/sign-in"
            className="text-sm font-medium text-brand-light transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            Sign In
          </Link>

          <Button
            render={<Link href="/sign-up" />}
            nativeButton={false}
            className="h-10 rounded-lg bg-brand px-5 text-sm font-medium text-brand-foreground hover:bg-brand/85"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-white hover:bg-white/10 hover:text-white md:hidden"
              />
            }
          >
            <Menu />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="border-white/10 bg-[#0b0b10] text-white"
          >
            <SheetHeader className="border-b border-white/10 pb-4">
              <SheetTitle className="flex items-center">
                <Image
                  src={logo}
                  alt="hireloop"
                  width={154}
                  height={44}
                  className="h-7 w-auto"
                />
              </SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation
              </SheetDescription>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClassName}
                >
                  {link.label}
                </Link>
              ))}

              <Separator className="my-3 bg-white/10" />

              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className={cn(
                  mobileLinkClassName,
                  "font-medium text-brand-light hover:text-white"
                )}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-11 items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/85"
              >
                Get Started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Navbar }
