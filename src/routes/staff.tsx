import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/staff")({
  component: StaffLayoutRoute,
})

function StaffLayoutRoute() {
  return <Outlet />
}

