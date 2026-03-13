import { createFileRoute } from "@tanstack/react-router"

import LandingPage from "@/pages/Landing-page"

export const Route = createFileRoute("/")({
  component: IndexRoute,
})

function IndexRoute() {
  return <LandingPage />
}
