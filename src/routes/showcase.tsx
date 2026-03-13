import { createFileRoute } from "@tanstack/react-router"

import ShowCasePage from "@/pages/ShowCase-page"

export const Route = createFileRoute("/showcase")({
  component: ShowcaseRoute,
})

function ShowcaseRoute() {
  return <ShowCasePage />
}
