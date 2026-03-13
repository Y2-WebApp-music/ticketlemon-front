import { EventCard } from "@/features/event-card"
import { Link } from "@tanstack/react-router"
import type { LandingEventItem } from "./recommended-events-section"

export interface AllEventsSectionProps {
  events: LandingEventItem[]
  imageUrl: string
}

export function AllEventsSection({ events, imageUrl }: AllEventsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl leading-7 font-normal text-foreground">
        All Events
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {events.map((event, i) =>
          event.id ? (
            <Link
              key={event.id + i}
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="block"
            >
              <EventCard
                variant="thumbnail"
                imageUrl={imageUrl}
                imageAlt=""
                date={event.date}
                title={event.title}
                venue={event.venue}
              />
            </Link>
          ) : (
            <EventCard
              key={i}
              variant="thumbnail"
              imageUrl={imageUrl}
              imageAlt=""
              date={event.date}
              title={event.title}
              venue={event.venue}
            />
          )
        )}
      </div>
    </section>
  )
}
