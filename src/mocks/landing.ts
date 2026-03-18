import type { EventCardItem } from "@/types/event"

export const eventImageUrl =
  "https://www.figma.com/api/mcp/asset/ad5869ca-1a65-46c6-9e38-a6f33c9bb552"

export const recommendedEvents: EventCardItem[] = [
  {
    event_id: "2",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    title: "Sunset by NEON: Upperground",
    venue: "Genting Highlands, Malaysia",
    poster_url: eventImageUrl,
  },
  {
    event_id: "1",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    venue: "Phenix Grand Ballroom",
    poster_url: eventImageUrl,
  },
  {
    event_id: "3",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    title: "UltraV presents LEE DONG WOOK 2025-2026 FAN MEETING",
    venue: "Phenix Grand Ballroom",
    poster_url: eventImageUrl,
  },
  {
    event_id: "4",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    title: "UltraV presents",
    venue: "Phenix Grand Ballroom",
    poster_url: eventImageUrl,
  },
  {
    event_id: "5",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    title: "UltraV presents LEE DONG WOOK 2025-2026 FAN MEETING",
    venue: "Phenix Grand Ballroom",
    poster_url: eventImageUrl,
  },
]

export const allEvents: EventCardItem[] = [
  ...recommendedEvents,
  ...recommendedEvents,
  ...recommendedEvents,
]
