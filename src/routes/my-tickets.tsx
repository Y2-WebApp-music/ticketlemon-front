import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/my-tickets")({
  component: MyTicketsRoute,
})

function MyTicketsRoute() {
  return <Outlet />
}
