import { createFileRoute } from "@tanstack/react-router"

import OrganizerDashboardPage from "@/pages/OrganizerDashboard-page"

export const Route = createFileRoute("/organizer/")({
  component: OrganizerDashboardRoute,
})

function OrganizerDashboardRoute() {
  return <OrganizerDashboardPage />
}
