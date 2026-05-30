import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MyTicketItem } from "@/types/my-ticket"
import { formatDateLabel } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"
import dayjs from "dayjs"
import { DollarSign, Ticket } from "lucide-react"

export interface MyTicketCardProps extends MyTicketItem {
  /** Label above ticket types list */
  ticket_type_label?: string
  className?: string
}

/**
 * My Ticket card with two responsive sizes:
 * - Desktop (sm+): larger image, full details, ticket type list, View Ticket / Purchase button
 * - Mobile: compact image, condensed text, same actions
 */
export function MyTicketCard({
  poster_url,
  title,
  show_start_date,
  show_end_date,
  venue,
  ticket_type,
  booking_time,
  event_id,
  is_purchased,
  ticket_type_label = "Your Ticket Type",
  className,
}: MyTicketCardProps) {
  const isUnpaid = !is_purchased
  const dateLabel = `${formatDateLabel(show_start_date)} - ${formatDateLabel(show_end_date)}`

  // payment window: 30 minutes from booking_time
  const minutesLeft = isUnpaid
    ? Math.max(
        0,
        Math.ceil(
          dayjs(booking_time).add(30, "minute").diff(dayjs()) / (60 * 1000)
        )
      )
    : undefined

  const purchaseLink = (
    <Link to="/events/$eventId/purchase" params={{ eventId: event_id }}>
      <DollarSign className="size-4" aria-hidden />
      Purchase
    </Link>
  )

  const cardContent = (
    <>
      {/* Image: smaller on mobile + desktop */}
      <div
        className={cn(
          "shrink-0 overflow-hidden bg-muted",
          "h-[180px] w-full rounded-t-xl sm:h-[240px] sm:w-[180px] sm:rounded-t-none sm:rounded-l-xl"
        )}
      >
        <img src={poster_url} alt="" className="size-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-xs leading-5 font-normal text-muted-foreground sm:text-sm sm:leading-5">
            {title}
          </p>
          <p className="text-xs font-medium text-primary sm:text-sm sm:leading-5">
            {dateLabel}
          </p>
          <p className="text-xs leading-[14px] font-medium text-muted-foreground sm:text-xs">
            {venue}
          </p>
        </div>
        {/* Ticket type + lines: hidden on mobile in compact variant; we show on both for usability */}
        {(ticket_type_label || ticket_type.length > 0) && (
          <div className="space-y-1">
            {ticket_type_label && (
              <div className="flex items-center gap-1.5">
                <Ticket
                  className="size-4 shrink-0 text-primary sm:size-5"
                  aria-hidden
                />
                <span className="text-xs font-medium text-primary sm:text-sm">
                  Your select ticket
                </span>
              </div>
            )}
            {ticket_type.map((line, i) => (
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
          {isUnpaid && minutesLeft != null && (
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              {minutesLeft} minute{minutesLeft !== 1 ? "s" : ""} left
            </span>
          )}
          {isUnpaid && minutesLeft != null && minutesLeft > 0 && (
            <Button asChild size="sm" className="shrink-0">
              {purchaseLink}
            </Button>
          )}
          {!isUnpaid && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="pointer-events-none shrink-0 border-primary/50 text-primary hover:bg-primary/10"
            >
              <span>
                <Ticket className="size-4" aria-hidden />
                View Ticket
              </span>
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

  if (!isUnpaid) {
    return (
      <Link
        to="/my-tickets/$ticketId"
        params={{ ticketId: event_id }}
        className={cardClass}
      >
        {cardContent}
      </Link>
    )
  }
  return <div className={cardClass}>{cardContent}</div>
}
