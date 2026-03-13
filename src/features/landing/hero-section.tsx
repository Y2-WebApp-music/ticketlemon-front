import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"

export function LandingHeroSection() {
  return (
    <div className="relative bg-linear-to-t from-background to-[#ffedd5] pt-12 pb-[290px] sm:pt-16 dark:to-primary/10">
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6">
        <h1 className="text-center text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl md:leading-[48px]">
          Discover Events
        </h1>
      </div>
      <div className="mx-auto mt-10 w-full max-w-[513px] px-4">
        <InputGroup className="h-auto rounded-full border-2 border-primary bg-card px-4 py-3 shadow-lg shadow-primary/20">
          <InputGroupAddon>
            <Search
              className="size-6 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search Event"
            className="min-w-0 text-base placeholder:text-muted-foreground"
            aria-label="Search events"
          />
        </InputGroup>
      </div>
    </div>
  )
}
