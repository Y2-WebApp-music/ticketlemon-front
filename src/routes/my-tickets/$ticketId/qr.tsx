import { createFileRoute } from "@tanstack/react-router"

import MyTicketQrPage from "@/pages/MyTicketQr-page"

export const Route = createFileRoute("/my-tickets/$ticketId/qr")({
  component: MyTicketQrRoute,
})

function MyTicketQrRoute() {
  const { ticketId } = Route.useParams()
  return <MyTicketQrPage ticketId={ticketId} />
}

