import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/events/$eventId")({
  component: EventsEventIdLayout,
})

function EventsEventIdLayout() {
  return <Outlet />
}
