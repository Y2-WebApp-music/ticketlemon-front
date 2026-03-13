import { format } from "date-fns"
import type { OutputData } from "@editorjs/editorjs"

export interface DateRangeEntry {
  id: string
  startDate: Date | undefined
  endDate: Date | undefined
  haveEndDate: boolean
  isCollapsed: boolean
}

export interface TicketTypeEntry {
  id: string
  name: string
  price: string
  quantity: string
  detail: string
  useForEventDateTime: string
  saleTicketOn: string
  isCollapsed: boolean
}

export interface StaffEntry {
  id: string
  reserveCode: string
  email: string
}

export interface CreateEventPayload {
  eventName: string
  category: string
  location: string
  impactGenre: string
  ageRestriction: string
  description: OutputData | null
  posterPreview: string | null
  thumbnailPreview: string | null
  eventDateEntries: DateRangeEntry[]
  saleDateEntries: DateRangeEntry[]
  ticketTypes: TicketTypeEntry[]
  ticketMinPerOrder: string
  ticketMaxPerOrder: string
  staffEntries: StaffEntry[]
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function createEmptyDateRangeEntry(): DateRangeEntry {
  return {
    id: createId(),
    startDate: undefined,
    endDate: undefined,
    haveEndDate: false,
    isCollapsed: false,
  }
}

export function createEmptyTicketTypeEntry(): TicketTypeEntry {
  return {
    id: createId(),
    name: "",
    price: "",
    quantity: "",
    detail: "",
    useForEventDateTime: "",
    saleTicketOn: "",
    isCollapsed: false,
  }
}

export function createEmptyStaffEntry(): StaffEntry {
  return { id: createId(), reserveCode: "", email: "" }
}

export function createInitialCreateEventPayload(): CreateEventPayload {
  return {
    eventName: "",
    category: "",
    location: "",
    impactGenre: "",
    ageRestriction: "No",
    description: null,
    posterPreview: null,
    thumbnailPreview: null,
    eventDateEntries: [createEmptyDateRangeEntry()],
    saleDateEntries: [createEmptyDateRangeEntry()],
    ticketTypes: [createEmptyTicketTypeEntry()],
    ticketMinPerOrder: "",
    ticketMaxPerOrder: "",
    staffEntries: [createEmptyStaffEntry()],
  }
}

export function formatDateRangeLabel(
  entry: Partial<DateRangeEntry> | undefined
): string {
  if (!entry?.startDate) return "—"
  const start = format(entry.startDate, "d MMM yyyy, HH:mm")
  const end =
    entry.haveEndDate && entry.endDate
      ? format(entry.endDate, "d MMM yyyy, HH:mm")
      : "—"
  return `${start} - ${end}`
}
