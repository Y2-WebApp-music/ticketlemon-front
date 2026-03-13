import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Radio, Target, Ticket, Timer } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { EventStatus } from "@/constants/event-status.constant"

/** Status badge variant: pass (green), warning (yellow), or use default/outline for On Sale / Sold Out etc. */
export type OrganizerEventStatus =
  | "show"      // pass (green)
  | "scheduled"  // warning (yellow)
  | "on_sale"   // primary
  | "sold_out"  // outline
  | "draft"     // secondary
  | "event_end" // secondary/muted
  | "cancel"    // destructive

export interface OrganizerEventCardProps {
  eventId: string
  imageUrl: string
  imageAlt?: string
  date: string
  title: string
  venue: string
  status: OrganizerEventStatus
  /** Bottom line e.g. "Show begin 17:00", "33,333 Remaining", "Start Sale 18 Feb 26, 15:00" */
  bottomLine: string
}

const statusToBadgeVariant: Record<
  OrganizerEventStatus,
  "pass" | "warning" | "default" | "outline" | "secondary" | "destructive"
> = {
  show: "pass",
  scheduled: "warning",
  on_sale: "default",
  sold_out: "outline",
  draft: "secondary",
  event_end: "secondary",
  cancel: "destructive",
}

const statusLabel: Record<OrganizerEventStatus, string> = {
  show: "Show",
  scheduled: "Scheduled",
  on_sale: "On Sale",
  sold_out: "Sold Out",
  draft: "Draft",
  event_end: "Event End",
  cancel: "Cancel",
}

export function OrganizerEventCard({
  eventId,
  imageUrl,
  imageAlt = "",
  date,
  title,
  venue,
  status,
  bottomLine,
}: OrganizerEventCardProps) {
  const badgeVariant = statusToBadgeVariant[status]
  const label = statusLabel[status]

  return (
    <Link
      to="/organizer/events/$eventId"
      params={{ eventId }}
      className="block h-full"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-240/320 w-full shrink-0 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="size-full object-cover"
          />
          <div className="absolute right-2 top-2">
            <Badge variant={badgeVariant} className="shadow-sm">
              {label}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <p className="text-lg font-medium leading-7 text-primary">{date}</p>
          <p className="line-clamp-2 text-sm font-normal leading-6 text-foreground">
            {title}
          </p>
          <p className="text-sm font-medium leading-[14px] text-muted-foreground">
            {venue}
          </p>
          {/* Dynamic Info */}
          <div className="mt-auto flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary">
            {status == EventStatus.SHOW ?
              <Target className="size-4 shrink-0" aria-hidden/>
              :
              status == EventStatus.ON_SALE ?
              <Ticket className="size-4 shrink-0" aria-hidden />
              :
              status == EventStatus.SOLD_OUT ?
              <Radio className="size-4 shrink-0" aria-hidden />
              :
              status == EventStatus.SCHEDULED ?
              <Timer className="size-4 shrink-0" aria-hidden />
              :
              status == EventStatus.END ?
                <Target className="size-4 shrink-0" aria-hidden/>
              :
                <Ticket className="size-4 shrink-0" aria-hidden />
            }
            {bottomLine}
          </div>
        </div>
      </Card>
    </Link>
  )
}
