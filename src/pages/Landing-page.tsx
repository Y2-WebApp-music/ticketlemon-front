import { PageLayout } from "@/components/layouts"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  AllEventsSection,
  LandingFooter,
  LandingHeroSection,
  RecommendedEventsSection,
} from "@/features/landing"
import type { EventListItem } from "@/types"
import { allEvents, recommendedEvents } from "@/mocks/landing"
import { useEffect, useState } from "react"

const AUTO_SCROLL_DELAY_MS = 4000

export default function LandingPage() {
  const [recommendedApi, setRecommendedApi] = useState<CarouselApi | null>(null)
  const [recommendedEventsState] =
    useState<EventListItem[]>(recommendedEvents)
  const [allEventsState] = useState<EventListItem[]>(allEvents)

  useEffect(() => {
    if (!recommendedApi) return
    const interval = setInterval(() => {
      recommendedApi.scrollNext()
    }, AUTO_SCROLL_DELAY_MS)
    return () => clearInterval(interval)
  }, [recommendedApi])

  return (
    <PageLayout>
      <LandingHeroSection />

      <div className="relative mx-auto -mt-[220px] max-w-[1280px] min-w-0 space-y-10 px-4 pb-16 sm:px-6">
        <RecommendedEventsSection
          events={[...recommendedEventsState, ...recommendedEventsState]}
          onCarouselApiChange={setRecommendedApi}
        />
        <AllEventsSection events={allEventsState} />
      </div>

      <LandingFooter />
    </PageLayout>
  )
}
