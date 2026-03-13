/** Organizer event status from API */
export type OrganizerEventStatus =
  | "show"
  | "scheduled"
  | "on_sale"
  | "sold_out"
  | "draft"
  | "event_end"
  | "cancel"

/** Organizer event (list/dashboard) API response */
export interface OrganizerEvent {
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
