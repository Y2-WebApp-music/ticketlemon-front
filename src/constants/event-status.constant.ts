export const EventStatus = {
  DRAFT: 1,
  SCHEDULED: 2,
  ON_SALE: 3,
  SOLD_OUT: 4,
  SHOW: 5,
  END: 6,
  CANCELLED: 7,
} as const

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus]

/** Badge variant per EventStatus (for organizer event hero, cards, etc.) */
export const EVENT_STATUS_BADGE_VARIANT: Record<
  EventStatus,
  "default" | "secondary" | "destructive" | "outline" | "pass" | "warning"
> = {
  [EventStatus.DRAFT]: "secondary",
  [EventStatus.SCHEDULED]: "warning",
  [EventStatus.ON_SALE]: "default",
  [EventStatus.SOLD_OUT]: "outline",
  [EventStatus.SHOW]: "pass",
  [EventStatus.END]: "secondary",
  [EventStatus.CANCELLED]: "destructive",
}

/** Resolve badge variant from API status_id; falls back to "default" if unknown */
export function getEventStatusBadgeVariant(
  statusId: number
): "default" | "secondary" | "destructive" | "outline" | "pass" | "warning" {
  return EVENT_STATUS_BADGE_VARIANT[statusId as EventStatus] ?? "default"
}

/** Organizer dashboard: Event Status filter dropdown options */
export const ORGANIZER_EVENT_STATUS_FILTER_OPTIONS = [
  { value: 0, label: "All" },
  { value: 1, label: "Show" },
  { value: 2, label: "On Sale" },
  { value: 3, label: "Schedule" },
  { value: 4, label: "Sold Out" },
  { value: 5, label: "Draft" },
  { value: 6, label: "Event End" },
  { value: 7, label: "Cancelled" },
] as const

export type OrganizerEventStatusFilterValue =
  (typeof ORGANIZER_EVENT_STATUS_FILTER_OPTIONS)[number]["value"]