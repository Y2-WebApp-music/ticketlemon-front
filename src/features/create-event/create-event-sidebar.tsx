import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const CREATE_EVENT_SIDEBAR_SECTIONS = [
  {
    id: "event-cover",
    label: "Event Cover",
    description: "Upload poster and thumbnail images for your event.",
  },
  {
    id: "event-name",
    label: "Event Name",
    description: "Basic event information: name, category, location, and age restriction.",
  },
  {
    id: "event-category",
    label: "Event Category",
    description: "Category and location for your event listing.",
  },
  {
    id: "event-description",
    label: "Event Description",
    description: "Add a description to help attendees understand your event.",
  },
  {
    id: "event-date-time",
    label: "Event Date and Time",
    description: "Set when your event starts and ends.",
  },
  {
    id: "sale-date-time",
    label: "Sale Ticket Date and Time",
    description: "Set when tickets go on sale and when sales end.",
  },
  {
    id: "ticket-type",
    label: "Ticket Type",
    description: "Add ticket types with name, price, and quantity.",
  },
  {
    id: "ticket-setting",
    label: "Ticket Setting",
    description: "Limit how many tickets can be bought per order.",
  },
  {
    id: "staff",
    label: "Staff",
    description: "Add staff members with reserve codes and email.",
  },
] as const

export interface CreateEventSidebarProps {
  onScrollToSection: (id: string) => void
  /** Section ids that are considered complete (dot shown in primary color). */
  completedSectionIds?: string[]
}

export function CreateEventSidebar({
  onScrollToSection,
  completedSectionIds = [],
}: CreateEventSidebarProps) {
  const completedSet = new Set(completedSectionIds)

  return (
    <aside className="top-24 order-first w-full shrink-0 lg:order-0 lg:sticky lg:top-24 lg:self-start lg:w-[280px]">
      <Card size="sm" className="py-4">
        <CardContent className="px-4">
          <ul className="flex flex-col gap-0">
            {CREATE_EVENT_SIDEBAR_SECTIONS.map(({ id, label, description }, index) => {
              const isComplete = completedSet.has(id)
              const isLast = index === CREATE_EVENT_SIDEBAR_SECTIONS.length - 1
              return (
                <li key={id} className="flex gap-3">
                  {/* Track: dot + connecting line to next */}
                  <div className="relative flex w-6 shrink-0 flex-col items-center">
                    <div className="relative z-10 flex size-6 items-center justify-center">
                      <span
                        className={cn(
                          "size-3 rounded-full shrink-0 transition-colors",
                          isComplete
                            ? "bg-primary"
                            : "bg-muted-foreground/40"
                        )}
                        aria-hidden
                      />
                    </div>
                    {!isLast && (
                      <div
                        className="absolute left-1/2 top-6 bottom-0 w-px -translate-x-px bg-border"
                        aria-hidden
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onScrollToSection(id)}
                    className={cn(
                      "min-w-0 flex-1 rounded-md px-2 py-2 text-left transition-colors",
                      "hover:bg-muted/60",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <div className="font-medium text-sm text-foreground">
                      {label}
                    </div>
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {description}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}
