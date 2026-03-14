/** Organizer event (list/dashboard) API response */
export interface OrganizerEvent {
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
