import { PageLayout } from "@/components/layouts"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  AllEventsSection,
  LandingFooter,
  LandingHeroSection,
  RecommendedEventsSection,
} from "@/features/landing"
import { allEvents, recommendedEvents } from "@/mocks/landing"
import type { EventCardItem } from "@/types/event"
import { useEffect, useState } from "react"

const AUTO_SCROLL_DELAY_MS = 4000

export default function LandingPage() {
  const [recommendedApi, setRecommendedApi] = useState<CarouselApi | null>(null)
  const [recommendedEventsState] = useState<EventCardItem[]>(recommendedEvents)
  const [allEventsState] = useState<EventCardItem[]>(allEvents)

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
          events={recommendedEventsState}
          onCarouselApiChange={setRecommendedApi}
        />
        <AllEventsSection events={allEventsState} />
      </div>

      <LandingFooter />
    </PageLayout>
  )
}
