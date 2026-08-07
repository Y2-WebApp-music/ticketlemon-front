import { createFileRoute } from "@tanstack/react-router"

import TestIframe from "@/pages/TestIframe"

export const Route = createFileRoute("/test-iframe")({
  component: TestIframeRoute,
})

function TestIframeRoute() {
  return <TestIframe />
}
