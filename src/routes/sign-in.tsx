import { createFileRoute } from "@tanstack/react-router"

import SignInPage from "@/pages/SignIn-page"

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>) => ({
    completeOrganizer:
      search.completeOrganizer === true || search.completeOrganizer === "true",
  }),
  component: SignInRoute,
})

function SignInRoute() {
  const { completeOrganizer } = Route.useSearch()
  return <SignInPage completeOrganizer={completeOrganizer} />
}
