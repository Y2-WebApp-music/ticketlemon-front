import type { EventStatus } from "@/constants/event-status.constant"

/** Organizer event (list/dashboard) API response */
export interface OrganizerEvent {
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

export interface SellingTableEventDateEntry {
  id: string
  start_date: string
}

export interface SellingTableTicketType {
  id: string
  name: string
  use_for_event_date_time: string
}

export interface SellingTableResponse {
  data: SellingTableRow[]
  total: number
  page: number
  perPage: number
  event_date_entries: SellingTableEventDateEntry[]
  ticket_types: SellingTableTicketType[]
}

export interface EventSellingQueryParams {
  page?: number
  per_page?: number
  event_date_entry_id?: string
  ticket_type_id?: string
  search?: string
  status?: string
}

export interface CheckInTableRow {
  name: string
  email: string
  /** ISO datetime string of event round time */
  eventRound: string
  ticketType: string
  /** ISO datetime string of check-in timestamp */
  checkInTime: string
}

export interface CheckInTableResponse {
  data: CheckInTableRow[]
  total: number
  page: number
  perPage: number
  event_date_entries: SellingTableEventDateEntry[]
  ticket_types: SellingTableTicketType[]
}

export interface EventCheckInQueryParams {
  page?: number
  per_page?: number
  event_date_entry_id?: string
  ticket_type_id?: string
  search?: string
}

export interface SellingTicketSelection {
  sessionLabel: string
  title: string
}
