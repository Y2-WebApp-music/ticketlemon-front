import { createFileRoute } from "@tanstack/react-router"

import StaffSignInPage from "@/pages/StaffSignIn-page"

export const Route = createFileRoute("/staff-sign-in")({
  component: StaffSignInRoute,
})

function StaffSignInRoute() {
  return <StaffSignInPage />
}
