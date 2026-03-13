import { createFileRoute } from "@tanstack/react-router"
import EventDetailPage from "@/pages/EventDetail-page"

export const Route = createFileRoute("/events/$eventId/")({
  component: EventDetailRoute,
})

function EventDetailRoute() {
  const { eventId } = Route.useParams()
  return <EventDetailPage eventId={eventId} />
}
