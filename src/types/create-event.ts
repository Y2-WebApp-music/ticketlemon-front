import { format } from "date-fns"

export interface DateRangeEntry {
  id: string
  startDate: Date | undefined
  startHour: string
  startMin: string
  endDate: Date | undefined
  endHour: string
  endMin: string
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

export function createId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function formatDateRangeLabel(
  entry: Partial<DateRangeEntry> | undefined
): string {
  if (!entry?.startDate) return "—"
  const start =
    format(entry.startDate, "d MMM yyyy") +
    (entry.startHour || entry.startMin
      ? `, ${entry.startHour || "00"}:${entry.startMin || "00"}`
      : "")
  const end =
    entry.haveEndDate && entry.endDate
      ? format(entry.endDate, "d MMM yyyy") +
        (entry.endHour || entry.endMin
          ? `, ${entry.endHour || "00"}:${entry.endMin || "00"}`
          : "")
      : "—"
  return `${start} - ${end}`
}
