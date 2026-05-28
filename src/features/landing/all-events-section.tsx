import { EventCard } from "@/features/event-card"
import type { EventCardItem } from "@/types/event"
import { formatTitleDate } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"

export interface AllEventsSectionProps {
  events: EventCardItem[]
}

export function AllEventsSection({ events }: AllEventsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl leading-7 font-normal text-foreground">
        All Events
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {events.map((event, i) =>
          event.event_id ? (
            <Link
              key={event.event_id + i}
              to="/events/$eventId"
              params={{ eventId: event.event_id }}
              className="block"
            >
              <EventCard
                variant="thumbnail"
                imageUrl={event.poster_url}
                imageAlt=""
                date={`${formatTitleDate(event.show_start_date)} - ${formatTitleDate(event.show_end_date)}`}
                title={event.title}
                venue={event.venue}
                status={event.status_id}
              />
            </Link>
          ) : (
            <EventCard
              key={i}
              variant="thumbnail"
              imageUrl={event.poster_url}
              imageAlt=""
              date={`${formatTitleDate(event.show_start_date)} - ${formatTitleDate(event.show_end_date)}`}
              title={event.title}
              venue={event.venue}
              status={event.status_id}
            />
          )
        )}
      </div>
    </section>
  )
}
