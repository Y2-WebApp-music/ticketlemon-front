import { createFileRoute } from "@tanstack/react-router"
import { Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/events/$eventId/choose")({
  component: ChooseTicketRoute,
})

function ChooseTicketRoute() {
  const { eventId } = Route.useParams()
  return <Navigate to="/events/$eventId" params={{ eventId }} />
}
