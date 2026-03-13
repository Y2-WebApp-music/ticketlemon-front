import CreateEventPage from "@/pages/CreateEvent-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/organizer/create")({
  component: CreateEventRoute,
})

function CreateEventRoute() {
  return <CreateEventPage />
}
