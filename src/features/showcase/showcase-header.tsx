import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "@tanstack/react-router"
import { MoonIcon, SunIcon } from "lucide-react"

export interface ShowcaseHeaderProps {
  theme: "light" | "dark"
  onToggleTheme: () => void
}

export function ShowcaseHeader({ theme, onToggleTheme }: ShowcaseHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Home</Link>
          </Button>
          <h1 className="text-lg font-semibold">Design System Showcase</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                <SunIcon className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <MoonIcon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === "dark" ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
