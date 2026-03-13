import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export function LandingFooter() {
  return (
    <footer
      className={cn("border-t-4 border-primary bg-muted/50", "py-10 sm:py-8")}
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-block rounded font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ticketlemon
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover and book events. Your tickets, one place.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Browse events
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Organizer Site
                </Link>
              </li>
              <li>
                <a
                  href="#faq"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="#about"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="rounded text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ticketlemon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
