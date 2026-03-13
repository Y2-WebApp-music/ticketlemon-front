import { createFileRoute } from "@tanstack/react-router"

import SignInPage from "@/pages/SignIn-page"

export const Route = createFileRoute("/sign-in")({
  component: SignInRoute,
})

function SignInRoute() {
  return <SignInPage />
}
