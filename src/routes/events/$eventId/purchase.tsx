import PurchaseTicketPage from "@/pages/PurchaseTicket-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/events/$eventId/purchase")({
  component: PurchaseTicketRoute,
})

function PurchaseTicketRoute() {
  const { eventId } = Route.useParams()
  return <PurchaseTicketPage eventId={eventId} />
}
