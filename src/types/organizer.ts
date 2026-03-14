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

export interface SellingTableRow {
  name: string
  email: string
  status: "purchased" | "pending"
  /** ISO datetime string of event round time */
  eventRound: string
  ticketType: string
  /** ISO datetime string of booking timestamp */
  bookingTime: string
}

export interface SellingTableResponse {
  data: SellingTableRow[]
  total: number
  page: number
  perPage: number
}

export interface SellingTicketSelection {
  sessionLabel: string
  title: string
}
