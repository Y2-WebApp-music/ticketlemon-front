import type { MyTicketItem } from "@/types/my-ticket"
import { eventImageUrl } from "@/mocks/landing"

export const myTicketsUserName = "Nut Somwang"

const baseTicket: Pick<
  MyTicketItem,
  "image_url" | "title" | "date" | "venue" | "ticket_lines"
> = {
  image_url: eventImageUrl,
  title:
    "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
  date: "8 Mar - 10 Mar",
  venue: "Phenix Grand Ballroom",
  ticket_lines: [
    "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)",
    "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)",
  ],
}

export const unpaidTickets: MyTicketItem[] = [
  {
    ...baseTicket,
    ticket_type_label: "Your select ticket",
    minutes_left: 28,
    purchase_to: "/events/1/purchase",
  },
]

export const paidTickets: MyTicketItem[] = [
  { ...baseTicket, view_to: "/my-tickets/1" },
  { ...baseTicket, view_to: "/my-tickets/1" },
  {
    ...baseTicket,
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    date: "28 Mar - 29 Mar",
    view_to: "/my-tickets/1",
  },
  { ...baseTicket, view_to: "/my-tickets/1" },
  { ...baseTicket, view_to: "/my-tickets/1" },
  { ...baseTicket, view_to: "/my-tickets/1" },
]
