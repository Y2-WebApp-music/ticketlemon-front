import { PageLayout } from "@/components/layouts"
import { TicketTypeCard } from "@/features/my-ticket-detail"
import { getMyTicketDetail } from "@/mocks/my-ticket-detail"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import * as React from "react"

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export default function MyTicketDetailPage({ ticketId }: { ticketId: string }) {
  const detail = getMyTicketDetail(ticketId)
  const navigate = useNavigate()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [qrOpen, setQrOpen] = React.useState(false)
  const [qrTicketTitle, setQrTicketTitle] = React.useState<string | null>(null)
  const [qrTicketDescription, setQrTicketDescription] = React.useState<
    string | null
  >(null)

  if (!detail) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
          <p className="text-sm text-muted-foreground">Ticket not found.</p>
          <Link
            to="/my-tickets"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Mobile hero image */}
      <div className="relative sm:hidden">
        <img
          src={detail.heroImageUrl}
          alt=""
          className="h-[125px] w-full object-cover"
        />
        <Link
          to="/my-tickets"
          className="absolute left-2 top-2 inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-primary backdrop-blur"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-[1336px] min-w-0 px-4 pb-20 pt-6 sm:px-6">
        {/* Desktop back */}
        <div className="hidden sm:block">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,706px)_minmax(0,610px)] lg:items-start">
          {/* Left column */}
          <div className="space-y-4">
            {/* Desktop hero image */}
            <div className="hidden overflow-hidden rounded-xl sm:block">
              <img
                src={detail.heroImageUrl}
                alt=""
                className="h-[220px] w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-base font-medium leading-6 text-foreground sm:text-xl sm:leading-7 sm:tracking-tight">
                {detail.title}
              </p>
              <p className="text-base font-medium text-primary sm:text-base">
                {detail.date}
              </p>
              <p className="text-sm text-muted-foreground">{detail.venue}</p>
              <div className="h-px w-full bg-border" aria-hidden />
            </div>

            {/* Description (desktop only per Figma layout) */}
            <div className="hidden space-y-2 sm:block">
              <p className="text-xl font-medium leading-7 text-foreground">
                {detail.descriptionTitle}
              </p>
              <div className="whitespace-pre-wrap text-base leading-6 text-foreground">
                {detail.description}
              </div>
            </div>
          </div>

          {/* Right column: tickets (desktop sticky), mobile: appears below header */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <p className="text-lg font-medium text-primary sm:text-xl sm:leading-7 sm:tracking-tight">
              {detail.ticketTitle}
            </p>
            <div className="space-y-4">
              {detail.ticketTypes.map((t, i) => (
                <TicketTypeCard
                  key={i}
                  {...t}
                  onClick={
                    t.variant === "unused"
                      ? () => {
                          setQrTicketTitle(t.title)
                          setQrTicketDescription(t.description)
                          if (isDesktop) {
                            setQrOpen(true)
                          } else {
                            navigate({
                              to: "/my-tickets/$ticketId/qr",
                              params: { ticketId },
                            })
                          }
                        }
                      : undefined
                  }
                  onViewQr={
                    t.variant === "unused"
                      ? () => {
                          setQrTicketTitle(t.title)
                          setQrTicketDescription(t.description)
                          setQrOpen(true)
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop QR dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">QR</p>
              <p className="text-xs text-muted-foreground">
                {qrTicketTitle ?? ""}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="flex size-[320px] items-center justify-center rounded-xl border-4 border-primary bg-muted/30">
                <p className="text-3xl font-medium tracking-tight text-foreground">
                  QR Zone
                </p>
              </div>
            </div>

            {qrTicketDescription && (
              <p className="text-sm text-muted-foreground">
                {qrTicketDescription}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

