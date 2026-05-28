import { EVENT_STATUS } from "@/constants/event-status.constant"
import type { EventStatus } from "@/constants/event-status.constant"
import type { OrganizerEvent } from "@/types/organizer"

export const ORGANIZER_NAME = "Organizers Name"

const placeholderImage =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&h=640&fit=crop"

function event(
  id: string,
  status: EventStatus,
  bottom_line: string,
  overrides?: Partial<OrganizerEvent>
): OrganizerEvent {
  return {
    event_id: id,
    image_url: placeholderImage,
    image_alt: "Event",
    date: "8 Mar - 10 Mar",
    title:
      "DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    venue: "Phenix Grand Ballroom",
    status,
    bottom_line,
    ...overrides,
  }
}

export const comingEvents: OrganizerEvent[] = [
  event("1", EVENT_STATUS.SHOW, "Show begin 17:00"),
  event("2", EVENT_STATUS.ON_SALE, "33,333 Remaining"),
  event("3", EVENT_STATUS.ON_SALE, "33,333 Remaining"),
  event("4", EVENT_STATUS.SOLD_OUT, "Sold Out"),
  event("5", EVENT_STATUS.SOLD_OUT, "Sold Out"),
]

export const allEvents: OrganizerEvent[] = [
  event("6", EVENT_STATUS.END, "Event End"),
  event("7", EVENT_STATUS.SCHEDULED, "Start Sale 18 Feb 26, 15:00"),
  event("8", EVENT_STATUS.SCHEDULED, "Start Sale 18 Feb 26, 15:00"),
  event("9", EVENT_STATUS.SCHEDULED, "Start Sale 18 Feb 26, 15:00"),
  event("10", EVENT_STATUS.SCHEDULED, "Start Sale 18 Feb 26, 15:00"),
  event("11", EVENT_STATUS.DRAFT, "Draft"),
  event("12", EVENT_STATUS.DRAFT, "Draft"),
  event("13", EVENT_STATUS.DRAFT, "Draft"),
  event("14", EVENT_STATUS.DRAFT, "Draft"),
  event("15", EVENT_STATUS.DRAFT, "Draft"),
]
