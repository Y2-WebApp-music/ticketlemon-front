import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { EventCard } from "@/features/event-card"
import type { EventListItem } from "@/types"
import { Link } from "@tanstack/react-router"

export interface RecommendedEventsSectionProps {
  events: EventListItem[]
  onCarouselApiChange: (api: CarouselApi | null) => void
}

export function RecommendedEventsSection({
  events,
  onCarouselApiChange,
}: RecommendedEventsSectionProps) {
  return (
    <section className="min-w-0 space-y-4">
      <h2 className="text-xl leading-7 font-normal text-foreground">
        Recommended Events
      </h2>
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={onCarouselApiChange}
        className="w-full"
      >
        <CarouselContent className="-ml-4 p-1">
          {events.map((event, i) => (
            <CarouselItem
              key={`${event.id ?? i}-${i}`}
              className="basis-full pl-4 sm:basis-[calc((100%-1rem))] md:basis-[calc((100%-3rem)/4)] lg:basis-[calc((100%-3rem)/4)] xl:basis-[calc((100%-4rem)/5)]"
            >
              {event.id ? (
                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="block"
                >
                  <EventCard
                    variant="thumbnail"
                    imageUrl={event.poster_url}
                    imageAlt=""
                    date={event.date}
                    title={event.title}
                    venue={event.venue}
                    className="w-full"
                  />
                </Link>
              ) : (
                <EventCard
                  variant="thumbnail"
                  imageUrl={event.poster_url}
                  imageAlt=""
                  date={event.date}
                  title={event.title}
                  venue={event.venue}
                  className="w-full"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
