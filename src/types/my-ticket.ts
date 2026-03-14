/** Ticket type variant in "my ticket" detail (e.g. unused vs used) */
export type MyTicketTicketTypeVariant = "unused" | "used"

/** Single ticket type as returned from my-ticket detail API */
export interface MyTicketTicketType {
  title: string
  description: string
  variant: MyTicketTicketTypeVariant
}

/** My ticket detail API response */
export interface MyTicketDetail {
  id: string
  hero_image_url: string
  title: string
  date: string
  venue: string
  description_title: string
  description: string
  ticket_title: string
  ticket_types: MyTicketTicketType[]
}

/** My ticket list item API response (one card in "my tickets" list) */
export interface MyTicketItem {
  image_url: string
  title: string
  date: string
  venue: string
  ticket_lines?: string[]
  ticket_type_label?: string
  /** When set, show unpaid state with countdown and purchase link */
  minutes_left?: number
  purchase_to?: string
  /** When set, show paid state with view ticket link */
  view_to?: string
}
