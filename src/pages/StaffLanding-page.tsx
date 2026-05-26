import { PageLayout } from "@/components/layouts/page-layout"
import { StaffEventCard } from "@/features/staff"
import { getAllEvents } from "@/services/eventService"
import type { EventCardItem } from "@/types/event"
import { formatTitleDate } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function StaffLandingPage() {
  const [staffEvents, setStaffEvents] = useState<EventCardItem[]>([])
  const [staffName] = useState("Staff")
  const [currentEvent, setCurrentEvent] = useState<EventCardItem | undefined>()

  useEffect(() => {
    const load = async () => {
      try {
        const events = await getAllEvents()
        const mapped: EventCardItem[] = events.map((event) => {
          const startDate = event.event_date_entries[0]?.start_date ?? ""
          const endDate =
            event.event_date_entries[event.event_date_entries.length - 1]?.start_date ??
            startDate
          return {
            event_id: event.id,
            show_start_date: startDate,
            show_end_date: endDate,
            title: event.event_name,
            venue: event.venue,
            poster_url: event.poster_url ?? "",
          }
        })

        setStaffEvents(mapped)
        setCurrentEvent(mapped[0])
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load staff events"
        toast.error(message)
      }
    }

    load()
  }, [])

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto flex max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary">Event Staff</h1>
            <p className="text-sm text-muted-foreground">{staffName}</p>
          </header>

          {currentEvent && (
            <section className="space-y-3">
              <h2 className="text-base font-medium text-foreground">
                Now Event
              </h2>
              <Link
                to="/staff/scan"
                search={{ eventId: currentEvent.event_id }}
              >
                <StaffEventCard
                  key={currentEvent.event_id}
                  highlight
                  title={currentEvent.title}
                  date_range={`${formatTitleDate(currentEvent.show_start_date)} - ${formatTitleDate(currentEvent.show_end_date)}`}
                  venue={currentEvent.venue}
                  image_url={currentEvent.poster_url}
                  className="cursor-pointer"
                />
              </Link>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-base font-medium text-foreground">All Event</h2>
            <div className="flex flex-col gap-3">
              {staffEvents.map((event) => (
                <Link
                  key={event.event_id}
                  to="/staff/scan"
                  search={{ eventId: event.event_id }}
                >
                  <StaffEventCard
                    title={event.title}
                    date_range={`${formatTitleDate(event.show_start_date)} - ${formatTitleDate(event.show_end_date)}`}
                    venue={event.venue}
                    image_url={event.poster_url}
                    className="cursor-pointer"
                  />
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
    </PageLayout>
  )
}
