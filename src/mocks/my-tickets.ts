import type { MyTicketItem } from "@/types/my-ticket"
import { eventImageUrl } from "@/mocks/landing"

export const myTicketsUserName = "Nut Somwang"

const baseTicket: Pick<
  MyTicketItem,
  | "poster_url"
  | "title"
  | "show_start_date"
  | "show_end_date"
  | "venue"
  | "ticket_type"
  | "booking_time"
  | "event_id"
  | "is_purchased"
> = {
  poster_url: eventImageUrl,
  title:
    "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
  show_start_date: "2026-03-29T17:00:00",
  show_end_date: "2026-04-02T17:00:00",
  venue: "Phenix Grand Ballroom",
  ticket_type: ["VVIP + Soundcheck", "VVIP + Soundcheck"],
  // within 30 minutes to show remaining time on unpaid cards
  booking_time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  event_id: "1",
  is_purchased: false,
}

export const unpaidTickets: MyTicketItem[] = [
  {
    ...baseTicket,
    is_purchased: false,
  },
]

export const paidTickets: MyTicketItem[] = [
  {
    ...baseTicket,
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    venue: "Phenix Grand Ballroom",
    ticket_type: ["VVIP + Soundcheck", "VVIP + Soundcheck"],
    booking_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    event_id: "2",
    is_purchased: true,
  },
]
