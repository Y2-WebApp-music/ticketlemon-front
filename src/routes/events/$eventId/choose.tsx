import { createFileRoute } from "@tanstack/react-router"
import ChooseTicketPage from "@/pages/ChooseTicket-page"

export const Route = createFileRoute("/events/$eventId/choose")({
  component: ChooseTicketRoute,
})

function ChooseTicketRoute() {
  const { eventId } = Route.useParams()
  return <ChooseTicketPage eventId={eventId} />
}
