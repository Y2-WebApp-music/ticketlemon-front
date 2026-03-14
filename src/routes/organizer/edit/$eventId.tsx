import EditEventPage from "@/pages/EditEvent-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/organizer/edit/$eventId")({
  component: EditEventRoute,
})

function EditEventRoute() {
  return <EditEventPage />
}
