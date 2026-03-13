import { RouterProvider } from "@tanstack/react-router"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./index.css"
import { router } from "./router"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </TooltipProvider>
  </ThemeProvider>
)
