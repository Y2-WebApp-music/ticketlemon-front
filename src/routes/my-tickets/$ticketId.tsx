import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/my-tickets/$ticketId")({
  component: MyTicketDetailRoute,
})

function MyTicketDetailRoute() {
  return <Outlet />
}

