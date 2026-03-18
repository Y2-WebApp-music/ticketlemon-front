import dayjs, { type Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

/**
 * Format ISO (or other parseable) date string for display.
 * @example formatDateLabel("2026-03-28T18:00:00") → "28 Mar 26, 18:00"
 */
export function formatDateLabel(iso: string): string {
  const d = dayjs(iso)
  if (!d.isValid()) return iso
  return d.format("D MMM YY, HH:mm")
}

/** Format milliseconds as "00 D 00 H 10 M 35 S" (days, hours, minutes, seconds) */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "00 D 00 H 00 M 00 S"
  const d = dayjs.duration(ms)
  const days = Math.floor(d.asDays())
  const hours = d.hours()
  const minutes = d.minutes()
  const seconds = d.seconds()
  return `${String(days).padStart(2, "0")} D ${String(hours).padStart(2, "0")} H ${String(minutes).padStart(2, "0")} M ${String(seconds).padStart(2, "0")} S`
}

/** Elapsed time from `from` to now (or to `to`). Returns ms. */
export function getElapsedMs(
  from: string | Dayjs,
  to?: string | Dayjs
): number {
  const fromDate = typeof from === "string" ? dayjs(from) : from
  const toDate =
    to != null ? (typeof to === "string" ? dayjs(to) : to) : dayjs()
  return Math.max(0, toDate.diff(fromDate))
}

/** Remaining time from now to `until`. Returns ms (0 if already past). */
export function getRemainingMs(until: string | Dayjs): number {
  const untilDate = typeof until === "string" ? dayjs(until) : until
  return Math.max(0, untilDate.diff(dayjs()))
}

export function formatTitleDate(iso: string): string {
  const d = dayjs(iso)
  if (!d.isValid()) return iso
  return d.format("D MMM")
}
