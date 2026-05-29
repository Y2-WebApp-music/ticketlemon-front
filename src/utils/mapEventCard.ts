import { resolveEventStatus } from "@/constants/event-status.constant"
import type { ApiEvent } from "@/types/api-response"
import type { EventCardItem } from "@/types/event"

export function mapApiEventToEventCardItem(event: ApiEvent): EventCardItem {
  const showStartDate = event.event_date_entries[0]?.start_date ?? ""
  const showEndDate =
    event.event_date_entries[event.event_date_entries.length - 1]?.start_date ??
    showStartDate

  return {
    event_id: event.id,
    show_start_date: showStartDate,
    show_end_date: showEndDate,
    title: event.event_name,
    venue: event.venue,
    poster_url: event.poster_url ?? "",
    status: resolveEventStatus(event.status, showEndDate),
  }
}
