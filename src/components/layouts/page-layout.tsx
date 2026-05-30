import LogoIcon from "@/assets/logo.svg?react"
import { useTheme } from "@/components/theme-provider"
import TicketlemonFull from "@/assets/ticketlemon-full.svg?react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/stores/user-store"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { LogOut, Menu, Moon, Sun, Ticket, UserCircle, X } from "lucide-react"
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
  const isStaff = pathname.startsWith("/staff")
  const role = isOrganizer ? "organizer" : isStaff ? "staff" : "customer"
  const isCustomer = role === "customer"
  const isStaffRole = role === "staff"
  const {
    menuOpen: mobileMenuOpen,
    closeMenu: closeMobileMenu,
    toggleMenu: toggleMobileMenu,
  } = useNavMenuState()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const userId = useUserStore((state) => state.user_id)
  const isSignedIn = Boolean(userId)

  const isMyTickets = pathname === "/my-tickets"
  const isProfile = pathname === "/profile"
  const headerHeight = 70
  const desktopLinkClass =
    "rounded-lg px-4 py-2 text-base font-medium text-primary hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const desktopActiveLinkClass =
    "rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const organizerDesktopLinks = [
    { to: "/", label: "Customer Site" },
    { to: "/profile", label: "Profile", requiresAuth: true },
  ] as const
  const customerDesktopLinks = [
    { to: "/organizer", label: "Organizer Site" },
    { to: "/my-tickets", label: "My ticket", isActive: isMyTickets },
    { to: "/profile", label: "Profile", isActive: isProfile },
  ] as const

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" && document.documentElement.classList.contains("dark"))

  const handleToggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const handleSignOut = () => {
    // Lazy import to avoid circular deps at module load
    import("@/services/authService").then(({ signOut }) => {
      signOut()
      closeMobileMenu()
      navigate({ to: "/sign-in", search: { completeOrganizer: false } })
    })
  }

  const visibleOrganizerDesktopLinks = organizerDesktopLinks.filter(
    (link) => isSignedIn || !("requiresAuth" in link && link.requiresAuth)
  )

  const showMobileMenu = isCustomer || isStaffRole

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="mx-auto flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6">
          {isCustomer ? (
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
            </div>
          ) : (
            <Link
              to={isStaffRole ? "/staff-sign-in" : "/organizer"}
              className="flex shrink-0 items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TicketlemonFull
                className="h-6 w-[159px] shrink-0 object-contain object-left"
                aria-label="ticketlemon"
              />
            </Link>
          )}

          {role === "organizer" && (
            <div className="flex shrink-0 items-center gap-5">
              {visibleOrganizerDesktopLinks.map((link, index) => (
                <React.Fragment key={link.to}>
                  <Link to={link.to} className={desktopLinkClass}>
                    {link.label}
                  </Link>
                  {index < visibleOrganizerDesktopLinks.length - 1 && (
                    <div className="h-9 w-px bg-border" aria-hidden />
                  )}
                </React.Fragment>
              ))}
              {isSignedIn ? (
                <ProfileAvatarMenu
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Button asChild>
                  <Link to="/sign-in" search={{ completeOrganizer: false }}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          )}

          {isStaffRole && (
            <ProfileAvatarMenu
              className="hidden sm:inline-flex"
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onSignOut={handleSignOut}
            />
          )}

          {isCustomer && (
            <nav className="hidden shrink-0 items-center gap-1 sm:flex">
              {isSignedIn ? (
                <>
                  {customerDesktopLinks.map((link, index) => (
                    <React.Fragment key={link.to}>
                      <Link
                        to={link.to}
                        className={
                          "isActive" in link
                            ? cn(
                                desktopActiveLinkClass,
                                link.isActive
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "text-primary hover:bg-muted"
                              )
                            : desktopLinkClass
                        }
                      >
                        {link.label}
                      </Link>
                      {index === 0 && (
                        <div className="h-9 w-px bg-border" aria-hidden />
                      )}
                    </React.Fragment>
                  ))}
                  <ProfileAvatarMenu
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={handleToggleDarkMode}
                    onSignOut={handleSignOut}
                  />
                </>
              ) : (
                <Button asChild>
                  <Link to="/sign-in" search={{ completeOrganizer: false }}>
                    Sign In
                  </Link>
                </Button>
              )}
            </nav>
          )}

          {showMobileMenu && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 rounded-lg sm:hidden"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          )}
        </div>
      </header>

      {isStaffRole && (
        <NavMenuSheet
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          headerHeight={headerHeight}
          className="z-50 sm:hidden"
        >
          <nav className="flex flex-col gap-3 px-4 py-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                handleToggleDarkMode()
                closeMobileMenu()
              }}
            >
              {isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              {isDarkMode ? "Light mode" : "Dark mode"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </nav>
        </NavMenuSheet>
      )}

      {isCustomer && (
        <NavMenuSheet
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          headerHeight={headerHeight}
          className="z-50 sm:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            {isSignedIn ? (
              <>
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
              </>
            ) : (
              <Button asChild className="w-full">
                <Link
                  to="/sign-in"
                  search={{ completeOrganizer: false }}
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              </Button>
            )}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  handleToggleDarkMode()
                  closeMobileMenu()
                }}
              >
                {isDarkMode ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                {isDarkMode ? "Light mode" : "Dark mode"}
              </Button>
            </div>
            {isSignedIn && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </nav>
        </NavMenuSheet>
      )}
    </>
  )
}

interface ProfileAvatarMenuProps {
  className?: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onSignOut: () => void
}

function ProfileAvatarMenu({
  className,
  isDarkMode,
  onToggleDarkMode,
  onSignOut,
}: ProfileAvatarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "ml-2 size-10 shrink-0 rounded-full bg-muted hover:bg-muted/80",
            className
          )}
          aria-label="Open profile menu"
        >
          <UserCircle className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Profile Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onToggleDarkMode}>
          {isDarkMode ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          {isDarkMode ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function useNavMenuState() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const closeMenu = React.useCallback(() => {
    setMenuOpen(false)
  }, [])

  const toggleMenu = React.useCallback(() => {
    setMenuOpen((open) => !open)
  }, [])

  React.useEffect(() => {
    if (!menuOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [menuOpen, closeMenu])

  return { menuOpen, closeMenu, toggleMenu }
}

interface NavMenuSheetProps {
  open: boolean
  onClose: () => void
  headerHeight: number
  className?: string
  children: React.ReactNode
}

function NavMenuSheet({
  open,
  onClose,
  headerHeight,
  className,
  children,
}: NavMenuSheetProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40",
        className,
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        style={{ top: headerHeight }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "fixed right-0 left-0 border-t border-border bg-card shadow-lg transition-[opacity,transform] duration-200 ease-out",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        )}
        style={{ top: headerHeight }}
      >
        {children}
      </div>
    </div>
  )
}
