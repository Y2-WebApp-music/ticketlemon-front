import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Ticket } from "lucide-react"

export type TicketTypeCardVariant = "unused" | "used"

export interface TicketTypeCardProps {
  title: string
  description: string
  variant: TicketTypeCardVariant
  onViewQr?: () => void
  onClick?: () => void
  className?: string
}

export function TicketTypeCard({
  title,
  description,
  variant,
  onViewQr,
  onClick,
  className,
}: TicketTypeCardProps) {
  const isUsed = variant === "used"

  return (
    <div
      className={cn(
        "w-full rounded-xl border bg-card p-4 shadow-sm sm:p-4",
        isUsed
          ? "border-border shadow-sm"
          : "border-primary shadow-[0_0_4px_0_var(--color-primary)]",
        isUsed && "opacity-50",
        !isUsed && onClick && "cursor-pointer",
        className
      )}
      role={!isUsed && onClick ? "button" : undefined}
      tabIndex={!isUsed && onClick ? 0 : undefined}
      onClick={!isUsed ? onClick : undefined}
      onKeyDown={
        !isUsed && onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick()
            }
          : undefined
      }
    >
      {/* Mobile: stack. Desktop: row with button on right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-6 text-foreground sm:text-lg sm:leading-7 sm:tracking-tight">
            {title}
          </p>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {description}
          </p>
        </div>

        {!isUsed && onViewQr && (
          <Button
            type="button"
            size="sm"
            className="hidden h-9 w-fit shrink-0 self-start px-3 sm:inline-flex sm:mt-0"
            onClick={(e) => {
              e.stopPropagation()
              onViewQr()
            }}
          >
            <Ticket className="size-4" aria-hidden />
            View QR Code
          </Button>
        )}
      </div>
    </div>
  )
}

