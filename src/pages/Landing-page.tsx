import { PageLayout } from "@/components/layouts"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  AllEventsSection,
  LandingFooter,
  LandingHeroSection,
  RecommendedEventsSection,
} from "@/features/landing"
import { getAllEvents, searchEvents } from "@/services/eventService"
import type { EventCardItem } from "@/types/event"
import { mapApiEventToEventCardItem } from "@/utils/mapEventCard"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const AUTO_SCROLL_DELAY_MS = 4000
const SEARCH_DEBOUNCE_MS = 300

export default function LandingPage() {
  const [recommendedApi, setRecommendedApi] = useState<CarouselApi | null>(null)
  const [recommendedEventsState, setRecommendedEventsState] = useState<
    EventCardItem[]
  >([])
  const [allEventsState, setAllEventsState] = useState<EventCardItem[]>([])
  const [searchResultsState, setSearchResultsState] = useState<EventCardItem[]>(
    []
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const displayedEventsState = debouncedSearch
    ? searchResultsState
    : allEventsState

  useEffect(() => {
    if (!recommendedApi) return
    const interval = setInterval(() => {
      recommendedApi.scrollNext()
    }, AUTO_SCROLL_DELAY_MS)
    return () => clearInterval(interval)
  }, [recommendedApi])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timerId)
  }, [searchQuery])

  useEffect(() => {
    const load = async () => {
      try {
        const events = await getAllEvents()
        const mapped = events.map(mapApiEventToEventCardItem)

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

    void load()
  }, [])

  useEffect(() => {
    if (!debouncedSearch) return

    let cancelled = false

    const search = async () => {
      try {
        const events = await searchEvents(debouncedSearch)
        if (cancelled) return
        setSearchResultsState(events.map(mapApiEventToEventCardItem))
      } catch (error) {
        if (cancelled) return
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to search events"
        toast.error(message)
        setSearchResultsState([])
      }
    }

    void search()

    return () => {
      cancelled = true
    }
  }, [debouncedSearch])

  return (
    <PageLayout>
      <LandingHeroSection
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="relative mx-auto -mt-[220px] max-w-[1280px] min-w-0 space-y-10 px-4 pb-16 sm:px-6">
        {!debouncedSearch && (
          <RecommendedEventsSection
            events={recommendedEventsState}
            onCarouselApiChange={setRecommendedApi}
          />
        )}
        <AllEventsSection
          events={displayedEventsState}
          title={debouncedSearch ? "Search Results" : "All Events"}
        />
      </div>

      <LandingFooter />
    </PageLayout>
  )
}
