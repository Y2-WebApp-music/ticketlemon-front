import { createFileRoute } from "@tanstack/react-router"

import ProfilePage from "@/pages/Profile-page"

export const Route = createFileRoute("/profile/")({
  component: ProfileRoute,
})

function ProfileRoute() {
  return <ProfilePage />
}

