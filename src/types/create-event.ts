import type { OutputData } from "@editorjs/editorjs"
import { format } from "date-fns"

export interface DateRangeEntry {
  id: string
  start_date: Date | undefined
  end_date: Date | undefined
  have_end_date: boolean
  is_collapsed: boolean
}

export interface TicketTypeEntry {
  id: string
  name: string
  price: string
  quantity: string
  detail: string
  use_for_event_date_time: string
  sale_ticket_on: string
  is_collapsed: boolean
}

export interface CreateEventPayload {
  event_name: string
  category: string
  venue: string
  impact_genre: string
  age_restriction: string
  description: OutputData | null
  poster_url: string | null
  thumbnail_url: string | null
  event_date_entries: DateRangeEntry[]
  sale_date_entries: DateRangeEntry[]
  ticket_types: TicketTypeEntry[]
  ticket_min_per_order: string
  ticket_max_per_order: string
  staff_code: string
  /** Creator metadata (optional) */
  create_by_id?: string
  create_by?: string
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function createEmptyDateRangeEntry(): DateRangeEntry {
  return {
    id: createId(),
    start_date: undefined,
    end_date: undefined,
    have_end_date: false,
    is_collapsed: false,
  }
}

export function createEmptyTicketTypeEntry(): TicketTypeEntry {
  return {
    id: createId(),
    name: "",
    price: "",
    quantity: "",
    detail: "",
    use_for_event_date_time: "",
    sale_ticket_on: "",
    is_collapsed: false,
  }
}

export function createInitialCreateEventPayload(): CreateEventPayload {
  return {
    event_name: "",
    category: "",
    venue: "",
    impact_genre: "",
    age_restriction: "0",
    description: null,
    poster_url: null,
    thumbnail_url: null,
    event_date_entries: [createEmptyDateRangeEntry()],
    sale_date_entries: [createEmptyDateRangeEntry()],
    ticket_types: [createEmptyTicketTypeEntry()],
    ticket_min_per_order: "",
    ticket_max_per_order: "",
    staff_code: "",
    create_by_id: "",
    create_by: "",
  }
}

export function formatDateRangeLabel(
  entry: Partial<DateRangeEntry> | undefined
): string {
  if (!entry?.start_date) return "—"
  const start = format(entry.start_date, "d MMM yyyy, HH:mm")
  if (!entry.have_end_date || !entry.end_date) return start
  const end = format(entry.end_date, "d MMM yyyy, HH:mm")
  return `${start} - ${end}`
}
