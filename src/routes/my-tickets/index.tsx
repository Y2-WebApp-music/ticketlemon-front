import { createFileRoute } from "@tanstack/react-router"

import MyTicketsPage from "@/pages/MyTickets-page"

export const Route = createFileRoute("/my-tickets/")({
  component: MyTicketsIndexRoute,
})

function MyTicketsIndexRoute() {
  return <MyTicketsPage />
}
