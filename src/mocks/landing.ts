import type { EventListItem } from "@/types/event"

export const eventImageUrl =
  "https://www.figma.com/api/mcp/asset/ad5869ca-1a65-46c6-9e38-a6f33c9bb552"

export const recommendedEvents: EventListItem[] = [
  {
    id: "2",
    date: "10 Feb - 15 Mar",
    title: "Sunset by NEON: Upperground",
    venue: "Genting Highlands, Malaysia",
  },
  {
    id: "1",
    date: "28 Mar - 29 Mar",
    title: "2026 JOY ASIA TOUR 'JOY SPLASH' IN BANGKOK",
    venue: "Phenix Grand Ballroom",
  },
  {
    id: "3",
    date: "8 Mar - 10 Mar",
    title: "UltraV presents LEE DONG WOOK 2025-2026 FAN MEETING",
    venue: "Phenix Grand Ballroom",
  },
  {
    id: "4",
    date: "8 Mar - 10 Mar",
    title: "UltraV presents",
    venue: "Phenix Grand Ballroom",
  },
  {
    id: "5",
    date: "8 Mar - 10 Mar",
    title: "UltraV presents LEE DONG WOOK 2025-2026 FAN MEETING",
    venue: "Phenix Grand Ballroom",
  },
]

export const allEvents: EventListItem[] = [
  ...recommendedEvents,
  ...recommendedEvents,
  ...recommendedEvents,
]
