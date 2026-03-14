import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { DollarSign, Ticket } from "lucide-react"

export interface MyTicketCardProps {
  /** Event image URL */
  image_url: string
  /** Event title */
  title: string
  /** Date range e.g. "8 Mar - 10 Mar" */
  date: string
  /** Venue name */
  venue: string
  /** Label above ticket lines e.g. "Your Ticket Type" or "Your select ticket" */
  ticket_type_label?: string
  /** Ticket line items e.g. "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)" */
  ticket_lines?: string[]
  /** Unpaid: show countdown and Purchase button. Omit for paid (View Ticket only) */
  minutes_left?: number
  /** Route path for View Ticket (e.g. /my-tickets/123). When set, card is a link (paid). */
  view_to?: string
  /** Route path for Purchase button (unpaid only) */
  purchase_to?: string
  className?: string
}

/**
 * My Ticket card with two responsive sizes:
 * - Desktop (sm+): larger image, full details, ticket type list, View Ticket / Purchase button
 * - Mobile: compact image, condensed text, same actions
 */
export function MyTicketCard({
  image_url,
  title,
  date,
  venue,
  ticket_type_label = "Your Ticket Type",
  ticket_lines = [],
  minutes_left,
  view_to,
  purchase_to,
  className,
}: MyTicketCardProps) {
  const isUnpaid = minutes_left != null
  const cardContent = (
    <>
      {/* Image: smaller on mobile + desktop */}
      <div
        className={cn(
          "shrink-0 overflow-hidden bg-muted",
          "h-[180px] w-full rounded-t-xl sm:h-[240px] sm:w-[180px] sm:rounded-t-none sm:rounded-l-xl"
        )}
      >
        <img src={image_url} alt="" className="size-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-xs leading-5 font-normal text-muted-foreground sm:text-sm sm:leading-5">
            {title}
          </p>
          <p className="text-xs font-medium text-primary sm:text-sm sm:leading-5">
            {date}
          </p>
          <p className="text-xs leading-[14px] font-medium text-muted-foreground sm:text-xs">
            {venue}
          </p>
        </div>
        {/* Ticket type + lines: hidden on mobile in compact variant; we show on both for usability */}
        {(ticket_type_label || ticket_lines.length > 0) && (
          <div className="space-y-1">
            {ticket_type_label && (
              <div className="flex items-center gap-1.5">
                <Ticket
                  className="size-4 shrink-0 text-primary sm:size-5"
                  aria-hidden
                />
                <span className="text-xs font-medium text-primary sm:text-sm">
                  {ticket_type_label}
                </span>
              </div>
            )}
            {ticket_lines.map((line, i) => (
              <p
                key={i}
                className="text-xs leading-[14px] font-medium text-foreground sm:text-xs"
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
              {minutes_left} minute{minutes_left !== 1 ? "s" : ""} left
            </span>
          )}
          {isUnpaid && purchase_to && (
            <Button asChild size="sm" className="shrink-0">
              <Link to={purchase_to}>
                <DollarSign className="size-4" aria-hidden />
                Purchase
              </Link>
            </Button>
          )}
          {!isUnpaid && view_to && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 border-primary/50 text-primary hover:bg-primary/10"
            >
              <Link to={view_to}>
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
    "max-w-full min-w-0",
    "sm:max-w-[600px]",
    className
  )

  if (view_to && !isUnpaid) {
    return (
      <Link to={view_to} className={cardClass}>
        {cardContent}
      </Link>
    )
  }
  return <div className={cardClass}>{cardContent}</div>
}
