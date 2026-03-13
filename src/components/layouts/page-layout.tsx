import LogoIcon from "@/assets/logo.svg?react"
import TicketlemonFull from "@/assets/ticketlemon-full.svg?react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Link, useRouterState } from "@tanstack/react-router"
import { LogOut, Menu, Ticket, UserCircle, X } from "lucide-react"
import * as React from "react"

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("min-h-svh bg-background", className)}>
      <NavBar />
      <main>{children}</main>
    </div>
  )
}

function NavBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isOrganizer = pathname.startsWith("/organizer")

  if (isOrganizer) {
    return <OrganizerNavBar />
  }
  return <CustomerNavBar />
}

function OrganizerNavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/organizer"
          className="flex shrink-0 items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TicketlemonFull
            className="h-6 w-[159px] shrink-0 object-contain object-left"
            aria-label="ticketlemon"
          />
        </Link>
        <div className="flex shrink-0 items-center gap-5">
          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-base font-medium text-primary hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Customer Site
          </Link>
          <div className="h-9 w-px bg-border" aria-hidden />
          <Link
            to="/profile"
            className="rounded-lg px-4 py-2 text-base font-medium text-primary hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Profile
          </Link>
          <div
            className="size-12 shrink-0 rounded-full bg-muted"
            aria-hidden
          />
        </div>
      </div>
    </header>
  )
}

function CustomerNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isMyTickets = pathname === "/my-tickets"
  const isProfile = pathname === "/profile"

  const closeMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  React.useEffect(() => {
    if (!mobileMenuOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [mobileMenuOpen, closeMobileMenu])

  const headerHeight = 70

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="mx-auto flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={closeMobileMenu}
            >
              <LogoIcon className="size-6 shrink-0" aria-hidden />
              <TicketlemonFull
                className="h-6 w-[159px] shrink-0 object-contain object-left"
                aria-label="ticketlemon"
              />
            </Link>
            <div className="hidden w-full max-w-[384px] md:block">
              <Input
                type="search"
                placeholder="Search event"
                className="h-9 w-full rounded-lg border-border bg-background text-base text-foreground placeholder:text-muted-foreground"
                aria-label="Search events"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden shrink-0 items-center gap-1 sm:flex">
            <Link
              to="/organizer"
              className="rounded-lg px-4 py-2 text-base font-medium text-primary hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Organizer Site
            </Link>
            <div className="h-9 w-px bg-border" aria-hidden />
            <Link
              to="/my-tickets"
              className={cn(
                "rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isMyTickets
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-primary hover:bg-muted"
              )}
            >
              My ticket
            </Link>
            <Link
              to="/profile"
              className={cn(
                "rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isProfile
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-primary hover:bg-muted"
              )}
            >
              Profile
            </Link>
            <div
              className="ml-2 size-10 shrink-0 rounded-full bg-muted"
              aria-hidden
            />
          </nav>

          {/* Mobile: hamburger */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 rounded-lg sm:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile menu: dim backdrop + panel overlaying content below navbar */}
      <div
        className={cn(
          "fixed inset-0 z-50 sm:hidden",
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={cn(
            "fixed right-0 bottom-0 left-0 bg-black/50 transition-opacity duration-200",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          style={{ top: headerHeight }}
          onClick={closeMobileMenu}
          aria-hidden
        />
        <div
          className={cn(
            "fixed right-0 left-0 border-t border-border bg-card shadow-lg transition-[opacity,transform] duration-200 ease-out",
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          )}
          style={{ top: headerHeight }}
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link
              to="/my-tickets"
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isMyTickets
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-primary hover:bg-muted"
              )}
              onClick={closeMobileMenu}
            >
              <Ticket className="size-5 shrink-0" aria-hidden />
              My Ticket
            </Link>
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isProfile
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-primary hover:bg-muted"
              )}
              onClick={closeMobileMenu}
            >
              <UserCircle className="size-5 shrink-0" aria-hidden />
              My Profile
            </Link>
            <div className="pt-2">
              <Button
                type="button"
                variant="destructive"
                className="w-full gap-2"
                onClick={() => {
                  closeMobileMenu()
                  // TODO: sign out
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
