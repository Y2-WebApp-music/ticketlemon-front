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
  poster_url: string
  title: string
  show_start_date: string
  show_end_date: string
  venue: string
  ticket_type: string[]
  // booking_time use to calculate minutes left
  booking_time: string
  // event_id use to navigate to event detail
  event_id: string
  // is_purchased use to show paid state
  is_purchased: boolean
}
