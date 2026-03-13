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
  heroImageUrl: string
  title: string
  date: string
  venue: string
  descriptionTitle: string
  description: string
  ticketTitle: string
  ticketTypes: MyTicketTicketType[]
}

/** My ticket list item API response (one card in "my tickets" list) */
export interface MyTicketItem {
  imageUrl: string
  title: string
  date: string
  venue: string
  ticketLines?: string[]
  ticketTypeLabel?: string
  /** When set, show unpaid state with countdown and purchase link */
  minutesLeft?: number
  purchaseTo?: string
  /** When set, show paid state with view ticket link */
  viewTo?: string
}
