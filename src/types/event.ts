import type { OutputData } from "@editorjs/editorjs"

/** Event list item (e.g. landing, search results) */
export interface EventCardItem {
  event_id: string
  show_start_date: string
  show_end_date: string
  title: string
  venue: string
  poster_url: string
  status_id: number
}

export interface EventTicketType {
  id: string
  title: string
  description?: string
  price: string
  total: number
  remaining: number
  start_sale_date: string
  end_sale_date: string | null
  event_date: string
  sold_out_date: string | null
}

/** Event detail API response */
export interface EventDetail {
  id: string
  status_id: number
  status_label: string
  title: string
  poster_url: string
  thumbnail_url: string
  event_date_entries: string[]
  venue: string
  age_restriction: number | null
  sale_date_entries: string[]
  description: OutputData
  ticket_types: EventTicketType[]
}

/** Organizer event detail API response (includes staff codes). */
export interface OrganizerEventDetail extends EventDetail {
  staff_code: string
}

/** Ticket option for choose-ticket (per session) */
export interface ChooseTicketOption {
  id: string
  title: string
  description?: string
  price: string
  /** Numeric value for total calculation (e.g. THB) */
  price_value: number
}

/** Session (date/time) with list of ticket types for choose-ticket API */
export interface ChooseTicketSession {
  session_label: string
  tickets: ChooseTicketOption[]
}
