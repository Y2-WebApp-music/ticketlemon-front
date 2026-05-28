import { createFileRoute } from "@tanstack/react-router"

import MyTicketDetailPage from "@/pages/MyTicketDetail-page"

export const Route = createFileRoute("/my-tickets/$ticketId/")({
  component: MyTicketDetailIndexRoute,
})

function MyTicketDetailIndexRoute() {
  const { ticketId: eventId } = Route.useParams()
  return <MyTicketDetailPage eventId={eventId} />
}
