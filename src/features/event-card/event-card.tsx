import { EventStatus } from "@/constants/event-status.constant"
import { cn } from "@/lib/utils"
import * as React from "react"

export interface EventCardBaseProps {
  /** Event title */
  title: string
  /** Optional subtitle / tour name */
  subtitle?: string
  /** Display date or date range */
  date: string
  /** Venue name */
  venue: string
  /** Optional link / href for the whole card */
  href?: string
  className?: string
  children?: React.ReactNode
  /** EventStatus numeric ID — shows an overlay for SOLD_OUT, END, CANCELLED */
  status?: number
}

const STATUS_OVERLAY: Partial<
  Record<EventStatus, { label: string; color: string; grayscale: boolean }>
> = {
  [EventStatus.SOLD_OUT]: {
    label: "Sold Out",
    color: "#fbbf24",
    grayscale: false,
  },
  [EventStatus.END]: {
    label: "Event Ended",
    color: "#e5e7eb",
    grayscale: true,
  },
  [EventStatus.CANCELLED]: {
    label: "Cancelled",
    color: "#f87171",
    grayscale: true,
  },
}

export interface EventCardProps extends EventCardBaseProps {
  variant: "thumbnail"
  /** Image URL for the thumbnail (shown on top of the card) */
  imageUrl: string
  /** Optional image alt text */
  imageAlt?: string
}

export function EventCard({
  title,
  date,
  venue,
  imageUrl,
  imageAlt = "",
  href,
  className,
  status,
}: EventCardProps) {
  const overlay =
    status !== undefined ? STATUS_OVERLAY[status as EventStatus] : undefined
  const dimText = !!overlay

  const content = (
    <article
      className={cn(
        "flex overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-shadow duration-200 hover:shadow-md hover:shadow-primary/30",
        "isolate min-h-[100px] w-full min-w-0 shrink-0 flex-row sm:h-auto sm:min-h-0 sm:flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative z-0 h-full min-h-0 w-[38%] shrink-0 overflow-hidden rounded-l-xl rounded-r-none bg-muted",
          "sm:aspect-200/300 sm:h-[75%] sm:w-full sm:shrink-0 sm:rounded-t-xl sm:rounded-r-xl sm:rounded-b-none",
          overlay?.grayscale && "grayscale"
        )}
      >
        <img src={imageUrl} alt={imageAlt} className="size-full object-cover" />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65">
            <span
              className="text-center text-xs font-black tracking-widest uppercase sm:text-sm"
              style={{ color: overlay.color }}
            >
              {overlay.label}
            </span>
          </div>
        )}
      </div>
      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 shrink-0 flex-col justify-start gap-0.5 bg-card p-4 sm:min-h-[100px] sm:flex-none sm:p-3"
        )}
      >
        <p
          className={cn(
            "text-sm leading-7 font-medium uppercase sm:leading-normal",
            dimText ? "text-muted-foreground" : "text-primary"
          )}
        >
          {date}
        </p>
        <p
          className={cn(
            "line-clamp-2 text-sm leading-snug font-semibold sm:text-sm",
            dimText ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {title}
        </p>
        <p className="line-clamp-1 text-xs leading-[14px] font-medium text-muted-foreground">
          {venue}
        </p>
      </div>
    </article>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {content}
      </a>
    )
  }
  return content
}
