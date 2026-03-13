import type { StaffEvent } from "@/types"

export const STAFF_NAME = "Nut Somwang"

export const STAFF_EVENTS: StaffEvent[] = [
  {
    id: "1",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    dateRange: "8 Mar - 10 Mar",
    venue: "Phenix Grand Ballroom",
    imageUrl:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    id: "2",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    dateRange: "15 Mar - 17 Mar",
    venue: "Phenix Grand Ballroom",
    imageUrl:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    id: "3",
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    dateRange: "22 Mar - 24 Mar",
    venue: "Phenix Grand Ballroom",
    imageUrl:
      "https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
]

export const STAFF_VALID_SCAN_CODE = "TICKETLEMON_STAFF_VALID_QR"
export const STAFF_DUPLICATE_SCAN_CODE = "TICKETLEMON_STAFF_DUPLICATE_QR"

export function getStaffEventById(eventId: string): StaffEvent | undefined {
  return STAFF_EVENTS.find((event) => event.id === eventId)
}
