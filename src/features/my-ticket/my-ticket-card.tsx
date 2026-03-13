import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { DollarSign, Ticket } from "lucide-react"

export interface MyTicketCardProps {
  /** Event image URL */
  imageUrl: string
  /** Event title */
  title: string
  /** Date range e.g. "8 Mar - 10 Mar" */
  date: string
  /** Venue name */
  venue: string
  /** Label above ticket lines e.g. "Your Ticket Type" or "Your select ticket" */
  ticketTypeLabel?: string
  /** Ticket line items e.g. "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)" */
  ticketLines?: string[]
  /** Unpaid: show countdown and Purchase button. Omit for paid (View Ticket only) */
  minutesLeft?: number
  /** Route path for View Ticket (e.g. /my-tickets/123). When set, card is a link (paid). */
  viewTo?: string
  /** Route path for Purchase button (unpaid only) */
  purchaseTo?: string
  className?: string
}

/**
 * My Ticket card with two responsive sizes:
 * - Desktop (sm+): larger image, full details, ticket type list, View Ticket / Purchase button
 * - Mobile: compact image, condensed text, same actions
 */
export function MyTicketCard({
  imageUrl,
  title,
  date,
  venue,
  ticketTypeLabel = "Your Ticket Type",
  ticketLines = [],
  minutesLeft,
  viewTo,
  purchaseTo,
  className,
}: MyTicketCardProps) {
  const isUnpaid = minutesLeft != null
  const cardContent = (
    <>
      {/* Image: smaller on mobile + desktop */}
      <div
        className={cn(
          "shrink-0 overflow-hidden bg-muted",
          "h-[180px] w-full rounded-t-xl sm:h-[240px] sm:w-[180px] sm:rounded-t-none sm:rounded-l-xl"
        )}
      >
        <img
          src={imageUrl}
          alt=""
          className="size-full object-cover"
        />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-xs font-normal leading-5 text-muted-foreground sm:text-sm sm:leading-5">
            {title}
          </p>
          <p className="text-xs font-medium text-primary sm:text-sm sm:leading-5">
            {date}
          </p>
          <p className="text-xs font-medium leading-[14px] text-muted-foreground sm:text-xs">
            {venue}
          </p>
        </div>
        {/* Ticket type + lines: hidden on mobile in compact variant; we show on both for usability */}
        {(ticketTypeLabel || ticketLines.length > 0) && (
          <div className="space-y-1">
            {ticketTypeLabel && (
              <div className="flex items-center gap-1.5">
                <Ticket
                  className="size-4 shrink-0 text-primary sm:size-5"
                  aria-hidden
                />
                <span className="text-xs font-medium text-primary sm:text-sm">
                  {ticketTypeLabel}
                </span>
              </div>
            )}
            {ticketLines.map((line, i) => (
              <p
                key={i}
                className="text-xs font-medium leading-[14px] text-foreground sm:text-xs"
              >
                {line}
              </p>
            ))}
          </div>
        )}
        {/* Footer: timer + Purchase (unpaid) or View Ticket (paid) */}
        <div className="mt-auto flex flex-wrap items-center justify-end gap-2 pt-2">
          {isUnpaid && (
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              {minutesLeft} minute{minutesLeft !== 1 ? "s" : ""} left
            </span>
          )}
          {isUnpaid && purchaseTo && (
            <Button asChild size="sm" className="shrink-0">
              <Link to={purchaseTo}>
                <DollarSign className="size-4" aria-hidden />
                Purchase
              </Link>
            </Button>
          )}
          {!isUnpaid && viewTo && (
            <Button asChild variant="outline" size="sm" className="shrink-0 border-primary/50 text-primary hover:bg-primary/10">
              <Link to={viewTo}>
                <Ticket className="size-4" aria-hidden />
                View Ticket
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  )

  const cardClass = cn(
    "flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm sm:flex-row",
    "min-w-0 max-w-full",
    "sm:max-w-[600px]",
    className
  )

  if (viewTo && !isUnpaid) {
    return (
      <Link to={viewTo} className={cardClass}>
        {cardContent}
      </Link>
    )
  }
  return <div className={cardClass}>{cardContent}</div>
}
