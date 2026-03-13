import { createFileRoute } from "@tanstack/react-router"

import StaffScanSuccessPage from "@/pages/StaffScanSuccess-page"

export const Route = createFileRoute("/staff/scan-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    eventId: typeof search.eventId === "string" ? search.eventId : "",
    code: typeof search.code === "string" ? search.code : "",
  }),
  component: StaffScanSuccessRoute,
})

function StaffScanSuccessRoute() {
  const { eventId, code } = Route.useSearch()
  return <StaffScanSuccessPage eventId={eventId} code={code} />
}

