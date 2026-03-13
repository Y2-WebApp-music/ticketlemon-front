import type { MyTicketItem } from "@/types/my-ticket"
import { eventImageUrl } from "@/mocks/landing"

export const myTicketsUserName = "Nut Somwang"

const baseTicket: Pick<
  MyTicketItem,
  "imageUrl" | "title" | "date" | "venue" | "ticketLines"
> = {
  imageUrl: eventImageUrl,
  title:
    "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
  date: "8 Mar - 10 Mar",
  venue: "Phenix Grand Ballroom",
  ticketLines: [
    "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)",
    "x2 VVIP + Soundcheck (29 Mar 2026, 17:00)",
  ],
}

export const unpaidTickets: MyTicketItem[] = [
  {
    ...baseTicket,
    ticketTypeLabel: "Your select ticket",
    minutesLeft: 28,
    purchaseTo: "/events/1/purchase",
  },
]

export const paidTickets: MyTicketItem[] = [
  { ...baseTicket, viewTo: "/my-tickets/1" },
  { ...baseTicket, viewTo: "/my-tickets/1" },
  {
    ...baseTicket,
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    date: "28 Mar - 29 Mar",
    viewTo: "/my-tickets/1",
  },
  { ...baseTicket, viewTo: "/my-tickets/1" },
  { ...baseTicket, viewTo: "/my-tickets/1" },
  { ...baseTicket, viewTo: "/my-tickets/1" },
]
