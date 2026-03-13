import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronUp, Settings } from "lucide-react"

export interface AccountSettingsSection {
  id: string
  label: string
}

export function AccountSettingsSidebar({
  sections,
  activeId,
  onSelect,
  className,
}: {
  sections: AccountSettingsSection[]
  activeId: string
  onSelect: (id: string) => void
  className?: string
}) {
  const [open, setOpen] = React.useState(true)

  return (
    <aside className={cn("w-full lg:w-[260px]", className)}>
      <div className="rounded-xl border border-border bg-card p-2">
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium",
            "bg-primary text-primary-foreground"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary-foreground/15">
              <Settings className="size-4" aria-hidden />
            </span>
            Account Setting
          </span>
          <ChevronUp
            className={cn("size-4 transition-transform", open ? "" : "rotate-180")}
            aria-hidden
          />
        </button>

        {open && (
          <nav className="mt-2 flex flex-col gap-1 px-1 pb-1">
            {sections.map((s) => {
              const active = s.id === activeId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {s.label}
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

