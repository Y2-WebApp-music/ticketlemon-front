import { createFileRoute } from "@tanstack/react-router"

import MyTicketQrPage from "@/pages/MyTicketQr-page"

export const Route = createFileRoute("/my-tickets/$ticketId/qr")({
  component: MyTicketQrRoute,
})

function MyTicketQrRoute() {
  const { ticketId: eventId } = Route.useParams()
  return <MyTicketQrPage eventId={eventId} />
}
