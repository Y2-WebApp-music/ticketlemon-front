import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Radio, Target, Ticket, Timer } from "lucide-react"
import { Link } from "@tanstack/react-router"
import {
  EventStatus,
  getEventStatusBadgeVariant,
} from "@/constants/event-status.constant"

export interface OrganizerEventCardProps {
  event_id: string
  image_url: string
  image_alt?: string
  date: string
  title: string
  venue: string
  status_id: number
  status_label: string
  /** Bottom line e.g. "Show begin 17:00", "33,333 Remaining", "Start Sale 18 Feb 26, 15:00" */
  bottom_line: string
}

export function OrganizerEventCard({
  event_id,
  image_url,
  image_alt = "",
  date,
  title,
  venue,
  status_id,
  status_label,
  bottom_line,
}: OrganizerEventCardProps) {
  const badgeVariant = getEventStatusBadgeVariant(status_id)
  const label = status_label

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
          <p className="text-lg leading-7 font-medium text-primary">{date}</p>
          <p className="line-clamp-2 text-sm leading-6 font-normal text-foreground">
            {title}
          </p>
          <p className="text-sm leading-[14px] font-medium text-muted-foreground">
            {venue}
          </p>
          {/* Dynamic Info */}
          <div className="mt-auto flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary">
            {status_id === EventStatus.SHOW ? (
              <Target className="size-4 shrink-0" aria-hidden />
            ) : status_id === EventStatus.ON_SALE ? (
              <Ticket className="size-4 shrink-0" aria-hidden />
            ) : status_id === EventStatus.SOLD_OUT ? (
              <Radio className="size-4 shrink-0" aria-hidden />
            ) : status_id === EventStatus.SCHEDULED ? (
              <Timer className="size-4 shrink-0" aria-hidden />
            ) : status_id === EventStatus.END ? (
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
