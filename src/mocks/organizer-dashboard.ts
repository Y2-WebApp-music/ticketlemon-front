import { EventStatus } from "@/constants/event-status.constant"
import type { OrganizerEvent } from "@/types/organizer"

export const ORGANIZER_NAME = "Organizers Name"

const placeholderImage =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&h=640&fit=crop"

function event(
  id: string,
  status_id: number,
  status_label: string,
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
    status_id,
    status_label,
    bottom_line,
    ...overrides,
  }
}

export const comingEvents: OrganizerEvent[] = [
  event("1", EventStatus.SHOW, "Show", "Show begin 17:00"),
  event("2", EventStatus.ON_SALE, "On Sale", "33,333 Remaining"),
  event("3", EventStatus.ON_SALE, "On Sale", "33,333 Remaining"),
  event("4", EventStatus.SOLD_OUT, "Sold Out", "Sold Out"),
  event("5", EventStatus.SOLD_OUT, "Sold Out", "Sold Out"),
]

export const allEvents: OrganizerEvent[] = [
  event("6", EventStatus.END, "Event End", "Event End"),
  event("7", EventStatus.SCHEDULED, "Scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("8", EventStatus.SCHEDULED, "Scheduled", "Start Sale 18 Feb 26, 15:00"),
  event("9", EventStatus.SCHEDULED, "Scheduled", "Start Sale 18 Feb 26, 15:00"),
  event(
    "10",
    EventStatus.SCHEDULED,
    "Scheduled",
    "Start Sale 18 Feb 26, 15:00"
  ),
  event("11", EventStatus.DRAFT, "Draft", "Draft"),
  event("12", EventStatus.DRAFT, "Draft", "Draft"),
  event("13", EventStatus.DRAFT, "Draft", "Draft"),
  event("14", EventStatus.DRAFT, "Draft", "Draft"),
  event("15", EventStatus.DRAFT, "Draft", "Draft"),
]
