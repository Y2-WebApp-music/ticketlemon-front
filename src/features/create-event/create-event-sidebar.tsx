import { Card, CardContent } from "@/components/ui/card"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import { cn } from "@/lib/utils"

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
    <aside className="top-24 order-first w-full shrink-0 lg:sticky lg:top-24 lg:order-0 lg:w-[280px] lg:self-start">
      <Card size="sm" className="py-4">
        <CardContent className="px-4">
          <ul className="flex flex-col gap-0">
            {CREATE_EVENT_SIDEBAR_SECTIONS.map(
              ({ id, label, description }, index) => {
                const isComplete = completedSet.has(id)
                const isLast =
                  index === CREATE_EVENT_SIDEBAR_SECTIONS.length - 1
                return (
                  <li key={id} className="flex gap-3">
                    {/* Track: dot + connecting line to next */}
                    <div className="relative flex w-6 shrink-0 flex-col items-center">
                      <div className="relative z-10 flex size-6 items-center justify-center">
                        <span
                          className={cn(
                            "size-3 shrink-0 rounded-full transition-colors",
                            isComplete ? "bg-primary" : "bg-muted-foreground/40"
                          )}
                          aria-hidden
                        />
                      </div>
                      {!isLast && (
                        <div
                          className="absolute top-6 bottom-0 left-1/2 w-px -translate-x-px bg-border"
                          aria-hidden
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onScrollToSection(id)}
                      className={cn(
                        "min-w-0 flex-1 rounded-md px-2 pb-2 text-left transition-colors",
                        "hover:bg-muted/60",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm font-medium text-foreground",
                          !isComplete && "opacity-50"
                        )}
                      >
                        {label}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-xs leading-snug text-muted-foreground",
                          !isComplete && "opacity-50"
                        )}
                      >
                        {description}
                      </div>
                    </button>
                  </li>
                )
              }
            )}
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}
