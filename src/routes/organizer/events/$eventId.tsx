import OrganizerEventDetailPage from "@/pages/OrganizerEventDetail-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/organizer/events/$eventId")({
  component: OrganizerEventDetailRoute,
})

function OrganizerEventDetailRoute() {
  const { eventId } = Route.useParams()
  return <OrganizerEventDetailPage eventId={eventId} />
}
