import { eventImageUrl } from "@/mocks/landing"
import type { MyTicketDetail } from "@/types/my-ticket"

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ut ex sed mattis. Nulla facilisi. Pellentesque vitae imperdiet justo, id scelerisque mauris. Nunc in lorem eget sem"

export const myTicketDetailsById: Record<string, MyTicketDetail> = {
  "1": {
    id: "1",
    poster_url: eventImageUrl,
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    show_start_date: "2026-03-29T17:00:00",
    show_end_date: "2026-04-02T17:00:00",
    venue: "Phenix Grand Ballroom",
    description:
      "เตรียมหัวใจไว้ให้ดี!!  JOY กำลังจะมาสาดความสดใสใส่ ReVeluv แบบไม่ทันตั้งตัว 💦🍀  ในงาน 2026 JOY ASIA TOUR ‘JOY SPLASH’ IN BANGKOK วันที่ 28 มีนาคม 2569 ที่ Phenix Grand Ballroom เวลา 18.00 น.\n\nชวนทุกคนมาสนุกสาดความสุขไปตามเสียงเพลง 💦🎶\n\nพร้อมการแสดงสุดพิเศษที่ JOY ตั้งใจจัดเต็ม 💖 เพื่อให้ทุกจังหวะ ทุกเสียงกรี๊ดและทุกโมเมนต์ให้กลายเป็นความทรงจำแสนพิเศษที่จะสร้างไปด้วยกัน!!",
    ticket_types: [
      {
        id: "1",
        variant: "unused",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
        event_date: "2026-03-29T17:00:00",
        qr_code: "1234567890",
      },
      {
        id: "2",
        variant: "unused",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
        event_date: "2026-03-29T17:00:00",
        qr_code: "1234567890",
      },
      {
        id: "3",
        variant: "used",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
        event_date: "2026-03-29T17:00:00",
        qr_code: "1234567890",
      },
    ],
  },
}

export function getMyTicketDetail(ticketId: string) {
  return myTicketDetailsById[ticketId]
}
