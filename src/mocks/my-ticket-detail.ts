import { eventImageUrl } from "@/mocks/landing"
import type { MyTicketDetail } from "@/types/my-ticket"

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ut ex sed mattis. Nulla facilisi. Pellentesque vitae imperdiet justo, id scelerisque mauris. Nunc in lorem eget sem"

export const myTicketDetailsById: Record<string, MyTicketDetail> = {
  "1": {
    id: "1",
    heroImageUrl: eventImageUrl,
    title:
      "UltraV presents LEE DONG WOOK 2025-2026 FANMEETING TOUR [MY SWEET HOME] in Bangkok 2026",
    date: "8 Mar - 10 Mar",
    venue: "Phenix Grand Ballroom",
    descriptionTitle: "Description",
    description:
      "เตรียมหัวใจไว้ให้ดี!!  JOY กำลังจะมาสาดความสดใสใส่ ReVeluv แบบไม่ทันตั้งตัว 💦🍀  ในงาน 2026 JOY ASIA TOUR ‘JOY SPLASH’ IN BANGKOK วันที่ 28 มีนาคม 2569 ที่ Phenix Grand Ballroom เวลา 18.00 น.\n\nชวนทุกคนมาสนุกสาดความสุขไปตามเสียงเพลง 💦🎶\n\nพร้อมการแสดงสุดพิเศษที่ JOY ตั้งใจจัดเต็ม 💖 เพื่อให้ทุกจังหวะ ทุกเสียงกรี๊ดและทุกโมเมนต์ให้กลายเป็นความทรงจำแสนพิเศษที่จะสร้างไปด้วยกัน!!",
    ticketTitle: "Your Ticket",
    ticketTypes: [
      {
        variant: "unused",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
      },
      {
        variant: "unused",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
      },
      {
        variant: "used",
        title: "VVIP + Soundcheck (29 Mar 2026, 17:00)",
        description: LOREM,
      },
    ],
  },
}

export function getMyTicketDetail(ticketId: string) {
  return myTicketDetailsById[ticketId]
}

