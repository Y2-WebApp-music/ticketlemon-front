/** Prisma `EventStatus` enum — same values returned by the API */
export type EventStatus =
  | "Draft"
  | "Scheduled"
  | "OnSale"
  | "SoldOut"
  | "Show"
  | "EventEnd"
  | "Cancel"

export const EVENT_STATUS = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ON_SALE: "OnSale",
  SOLD_OUT: "SoldOut",
  SHOW: "Show",
  END: "EventEnd",
  CANCELLED: "Cancel",
} as const satisfies Record<string, EventStatus>

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  Draft: "Draft",
  Scheduled: "Scheduled",
  OnSale: "On Sale",
  SoldOut: "Sold Out",
  Show: "Show",
  EventEnd: "Event End",
  Cancel: "Cancelled",
}

export const EVENT_STATUS_BADGE_VARIANT: Record<
  EventStatus,
  "default" | "secondary" | "destructive" | "outline" | "pass" | "warning"
> = {
  Draft: "secondary",
  Scheduled: "warning",
  OnSale: "default",
  SoldOut: "outline",
  Show: "pass",
  EventEnd: "secondary",
  Cancel: "destructive",
}

export function getEventStatusLabel(
  status: EventStatus | string | null | undefined
): string {
  if (!status) return ""
  return EVENT_STATUS_LABEL[status as EventStatus] ?? status
}

export function getEventStatusBadgeVariant(
  status: EventStatus | string | null | undefined
): "default" | "secondary" | "destructive" | "outline" | "pass" | "warning" {
  if (!status || !(status in EVENT_STATUS_BADGE_VARIANT)) return "default"
  return EVENT_STATUS_BADGE_VARIANT[status as EventStatus]
}

const EVENT_STATUS_SET = new Set<string>(Object.values(EVENT_STATUS))

/** Resolve API status; infers EventEnd from date when status is missing. */
export function resolveEventStatus(
  prismaStatus: string | null | undefined,
  showEndDate: string
): EventStatus {
  if (prismaStatus && EVENT_STATUS_SET.has(prismaStatus)) {
    return prismaStatus as EventStatus
  }
  if (showEndDate && new Date(showEndDate) < new Date()) {
    return EVENT_STATUS.END
  }
  return EVENT_STATUS.ON_SALE
}

/** Organizer dashboard: Event Status filter dropdown options */
export const ORGANIZER_EVENT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: EVENT_STATUS.SHOW, label: "Show" },
  { value: EVENT_STATUS.ON_SALE, label: "On Sale" },
  { value: EVENT_STATUS.SCHEDULED, label: "Schedule" },
  { value: EVENT_STATUS.SOLD_OUT, label: "Sold Out" },
  { value: EVENT_STATUS.DRAFT, label: "Draft" },
  { value: EVENT_STATUS.END, label: "Event End" },
  { value: EVENT_STATUS.CANCELLED, label: "Cancelled" },
] as const

export type OrganizerEventStatusFilterValue =
  (typeof ORGANIZER_EVENT_STATUS_FILTER_OPTIONS)[number]["value"]
