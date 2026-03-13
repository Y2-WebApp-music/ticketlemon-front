import { createFileRoute } from "@tanstack/react-router"

import StaffScanPage from "@/pages/StaffScan-page"

export const Route = createFileRoute("/staff/scan")({
  validateSearch: (search: Record<string, unknown>) => ({
    eventId: typeof search.eventId === "string" ? search.eventId : "",
  }),
  component: StaffScanRoute,
})

function StaffScanRoute() {
  const { eventId } = Route.useSearch()
  return <StaffScanPage eventId={eventId} />
}

