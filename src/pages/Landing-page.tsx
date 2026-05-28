import { PageLayout } from "@/components/layouts"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  AllEventsSection,
  LandingFooter,
  LandingHeroSection,
  RecommendedEventsSection,
} from "@/features/landing"
import { getAllEvents } from "@/services/eventService"
import { resolveEventStatusId } from "@/constants/event-status.constant"
import type { EventCardItem } from "@/types/event"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const AUTO_SCROLL_DELAY_MS = 4000

export default function LandingPage() {
  const [recommendedApi, setRecommendedApi] = useState<CarouselApi | null>(null)
  const [recommendedEventsState, setRecommendedEventsState] = useState<
    EventCardItem[]
  >([])
  const [allEventsState, setAllEventsState] = useState<EventCardItem[]>([])

  useEffect(() => {
    if (!recommendedApi) return
    const interval = setInterval(() => {
      recommendedApi.scrollNext()
    }, AUTO_SCROLL_DELAY_MS)
    return () => clearInterval(interval)
  }, [recommendedApi])

  useEffect(() => {
    const load = async () => {
      try {
        const events = await getAllEvents()
        const mapped: EventCardItem[] = events.map((event) => {
          const startDate = event.event_date_entries[0]?.start_date ?? ""
          const endDate =
            event.event_date_entries[event.event_date_entries.length - 1]
              ?.start_date ?? startDate

          return {
            event_id: event.id,
            show_start_date: startDate,
            show_end_date: endDate,
            title: event.event_name,
            venue: event.venue,
            poster_url: event.poster_url ?? "",
            status_id: resolveEventStatusId(event.status, endDate),
          }
        })

        setAllEventsState(mapped)
        setRecommendedEventsState(mapped.slice(0, 5))
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load events"
        toast.error(message)
      }
    }

    load()
  }, [])

  return (
    <PageLayout>
      <LandingHeroSection />

      <div className="relative mx-auto -mt-[220px] max-w-[1280px] min-w-0 space-y-10 px-4 pb-16 sm:px-6">
        <RecommendedEventsSection
          events={recommendedEventsState}
          onCarouselApiChange={setRecommendedApi}
        />
        <AllEventsSection events={allEventsState} />
      </div>

      <LandingFooter />
    </PageLayout>
  )
}
