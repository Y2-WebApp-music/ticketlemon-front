import type { OrganizerEvent, OrganizerEventStatus } from "@/types/organizer"

export const ORGANIZER_NAME = "Organizers Name"

const placeholderImage =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&h=640&fit=crop"

function event(
  id: string,
  status: OrganizerEventStatus,
  bottomLine: string,
  overrides?: Partial<OrganizerEvent>
): OrganizerEvent {
  return {
    eventId: id,
    imageUrl: placeholderImage,
    imageAlt: "Event",
    date: "8 Mar - 10 Mar",
    title:
      "DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    venue: "Phenix Grand Ballroom",
    status,
    bottomLine,
    ...overrides,
  }
}

export const comingEvents: OrganizerEvent[] = [
  event("1", "show", "Show begin 17:00"),
  event("2", "on_sale", "33,333 Remaining"),
  event("3", "on_sale", "33,333 Remaining"),
  event("4", "sold_out", "Sold Out"),
  event("5", "sold_out", "Sold Out"),
]

export const allEvents: OrganizerEvent[] = [
  event("6", "event_end", "Event End"),
  event("7", "scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("8", "scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("9", "scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("10", "scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("11", "draft", "Draft"),
  event("12", "draft", "Draft"),
  event("13", "draft", "Draft"),
  event("14", "draft", "Draft"),
  event("15", "draft", "Draft"),
]
