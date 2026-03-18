import type { EventCardItem } from "@/types/event"
import type { StaffEventScanResult } from "@/types/staff"

export const STAFF_NAME = "Nut Somwang"

export const STAFF_EVENTS: EventCardItem[] = [
  {
    event_id: "1",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    venue: "Phenix Grand Ballroom",
    poster_url:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    event_id: "2",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    venue: "Phenix Grand Ballroom",
    poster_url:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    event_id: "3",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    venue: "Phenix Grand Ballroom",
    poster_url:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
]

export const STAFF_EVENT_SCAN_RESULT: StaffEventScanResult = {
  name: "Chotanansub Sophaken",
  age: 20,
  ticket_type: "VVIP + Soundcheck",
  ticket_detail:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ut ex sed mattis. Nulla facilisi. Pellentesque vitae imperdiet justo, id scelerisque mauris. Nunc in lorem eget sem",
  check_in_time: "2026-03-29T16:24:35",
}

export const STAFF_VALID_SCAN_CODE = "TICKETLEMON_STAFF_VALID_QR"
export const STAFF_DUPLICATE_SCAN_CODE = "TICKETLEMON_STAFF_DUPLICATE_QR"

export function getStaffEventById(eventId: string): EventCardItem | undefined {
  return STAFF_EVENTS.find((event) => event.event_id === eventId)
}
