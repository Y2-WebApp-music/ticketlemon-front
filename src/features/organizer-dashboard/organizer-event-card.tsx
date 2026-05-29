import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Radio, Target, Ticket, Timer } from "lucide-react"
import { Link } from "@tanstack/react-router"
import {
  EVENT_STATUS,
  getEventStatusBadgeVariant,
  getEventStatusLabel,
  type EventStatus,
} from "@/constants/event-status.constant"
import { formatTitleDate } from "@/utils/formatDate"

export interface OrganizerEventCardProps {
  event_id: string
  image_url: string
  image_alt?: string
  show_start_date: string
  show_end_date: string
  title: string
  venue: string
  status: EventStatus
  /** Bottom line e.g. "Show begin 17:00", "33,333 Remaining", "Start Sale 18 Feb 26, 15:00" */
  bottom_line: string
}

export function OrganizerEventCard({
  event_id,
  image_url,
  image_alt = "",
  show_start_date,
  show_end_date,
  title,
  venue,
  status,
  bottom_line,
}: OrganizerEventCardProps) {
  const badgeVariant = getEventStatusBadgeVariant(status)
  const label = getEventStatusLabel(status)

  return (
    <Link
      to="/organizer/events/$eventId"
      params={{ eventId: event_id }}
      className="block h-full"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-240/320 w-full shrink-0 overflow-hidden bg-muted">
          <img
            src={image_url}
            alt={image_alt}
            className="size-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={badgeVariant} className="shadow-sm">
              {label}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <p className="text-base leading-6 font-medium text-primary">
            {title}
          </p>
          <p className="line-clamp-2 text-sm leading-6 font-normal text-foreground">
            {show_start_date
              ? `${formatTitleDate(show_start_date)} - ${formatTitleDate(show_end_date || show_start_date)}`
              : "No schedule"}
          </p>
          <p className="text-sm leading-[14px] font-medium text-muted-foreground">
            {venue}
          </p>
          <div className="mt-auto flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary">
            {status === EVENT_STATUS.SHOW ? (
              <Target className="size-4 shrink-0" aria-hidden />
            ) : status === EVENT_STATUS.ON_SALE ? (
              <Ticket className="size-4 shrink-0" aria-hidden />
            ) : status === EVENT_STATUS.SOLD_OUT ? (
              <Radio className="size-4 shrink-0" aria-hidden />
            ) : status === EVENT_STATUS.SCHEDULED ? (
              <Timer className="size-4 shrink-0" aria-hidden />
            ) : status === EVENT_STATUS.END ? (
              <Target className="size-4 shrink-0" aria-hidden />
            ) : (
              <Ticket className="size-4 shrink-0" aria-hidden />
            )}
            {bottom_line}
          </div>
        </div>
      </Card>
    </Link>
  )
}
