import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/organizer")({
  component: OrganizerLayout,
})

function OrganizerLayout() {
  return <Outlet />
}
