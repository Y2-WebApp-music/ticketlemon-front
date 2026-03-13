import type { EventDetail } from "@/types/event"

export const eventDetailImageUrl = "https://picsum.photos/400/600"

/** Mock event detail by id (key = eventId from route) */
export const eventDetailsById: Record<string, EventDetail> = {
  "1": {
    id: "1",
    status_id: 3,
    status_label: "On Sale",
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    poster_url: eventDetailImageUrl,
    thumbnail_url: eventDetailImageUrl,
    show_date_list: [new Date().toISOString(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString()],
    // collect start sale date
    sale_date_list: [new Date().toISOString(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString()],
    venue: "Phenix Grand Ballroom",
    age_restriction: null,
    description: {
      time: Date.now(),
      blocks: [
        {
          id: "desc-1",
          type: "paragraph",
          data: {
            text: "Get your hearts ready!! JOY is about to splash ReVeluv with bright, refreshing energy before you even realize it 💦🍀 at 2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK on March 28, 2026 at Phenix Grand Ballroom, starting at 6:00 PM.",
          },
        },
        {
          id: "desc-2",
          type: "paragraph",
          data: {
            text: "Join us and dive into waves of happiness through the music 💦🎶 with special performances that JOY has prepared with all her heart 💖 Every beat, every cheer, and every moment will become unforgettable memories we create together!!",
          },
        },
        {
          id: "desc-3",
          type: "header",
          data: { text: "Event Details", level: 2 },
        },
        {
          id: "desc-4",
          type: "list",
          data: {
            style: "unordered",
            items: [
              "🗓 Saturday, March 28, 2026",
              "🕕 Show Time: 6:00 PM",
              "📍 Phenix Grand Ballroom",
              "🎫 Ticket Sales Open: Saturday, February 28, 2026 at 12:00 PM",
              "🎟 Ticket Platforms: Ticketlemon, Trip",
            ],
          },
        },
      ],
      version: "2.31.4",
    },
    ticketTypes: [
      {
        id: "tt-1",
        title: "Standard Entry",
        description:
          "General admission. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "800 ",
        total: 1200,
        remaining: 1200,
        start_sale_date: "2026-02-28T12:00:00",
        end_sale_date: null,
        event_date: "2026-03-28T18:00:00",
        sold_out_date: null,
      },
      {
        id: "tt-2",
        title: "Early Bird",
        description:
          "Limited early bird tickets. Maecenas mattis ut ex sed mattis. Nulla facilisi.",
        price: "600 ",
        total: 500,
        remaining: 0,
        start_sale_date: "2026-02-01T10:00:00",
        end_sale_date: "2026-02-15T23:59:59",
        event_date: "2026-03-28T18:00:00",
        sold_out_date: "2026-02-15T20:00:00",
      },
      {
        id: "tt-3",
        title: "Group Discount",
        description:
          "Available for groups of 10+. Pellentesque vitae imperdiet justo, id scelerisque mauris.",
        price: "1,200 ",
        total: 200,
        remaining: 200,
        start_sale_date: "2026-03-23T10:00:00",
        end_sale_date: null,
        event_date: "2026-03-28T18:00:00",
        sold_out_date: null,
      },
      {
        id: "tt-4",
        title: "Group Discount (Sale End)",
        description:
          "Available for groups of 10+. Pellentesque vitae imperdiet justo, id scelerisque mauris.",
        price: "1,200",
        total: 100,
        remaining: 0,
        start_sale_date: "2026-03-01T10:00:00",
        end_sale_date: "2026-03-23T10:00:00",
        event_date: "2026-03-29T17:00:00",
        sold_out_date: null,
      },
    ],
  },
}

/** Get event detail by id; returns undefined if not found */
export function getEventDetail(eventId: string) {
  return eventDetailsById[eventId]
}