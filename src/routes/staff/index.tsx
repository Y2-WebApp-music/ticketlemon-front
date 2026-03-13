import { createFileRoute } from "@tanstack/react-router"

import StaffLandingPage from "@/pages/StaffLanding-page"

export const Route = createFileRoute("/staff/")({
  component: StaffLandingRoute,
})

function StaffLandingRoute() {
  return <StaffLandingPage />
}
