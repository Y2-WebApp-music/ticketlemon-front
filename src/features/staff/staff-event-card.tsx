import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StaffEventCardProps {
  title: string
  dateRange: string
  venue: string
  imageUrl: string
  imageAlt?: string
  /** Highlight current event with primary shadow and border */
  highlight?: boolean
  className?: string
}

export function StaffEventCard({
  title,
  dateRange,
  venue,
  imageUrl,
  imageAlt = "",
  highlight = false,
  className,
}: StaffEventCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "flex flex-row sm:flex-col h-auto w-full items-stretch gap-0 rounded-xl bg-card p-0 data-[size=sm]:gap-0 data-[size=sm]:py-0 shadow-[0_0_6px_0_rgba(0,0,0,0.09)]",
        "transition-shadow duration-200",
        highlight &&
          "border-orange-300 shadow-[0_0_6px_0_rgba(249,115,22,0.7)]",
        className
      )}
    >
      <div className="relative w-[120px] shrink-0 self-stretch overflow-hidden rounded-l-xl bg-muted sm:h-[170px] sm:w-full sm:rounded-l-none sm:rounded-t-xl">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="py-2 flex min-w-0 flex-1 flex-col gap-1 px-4">
        <p className="line-clamp-2 text-sm font-medium leading-6 text-foreground sm:text-base">
          {title}
        </p>
        <p className="mt-1 text-sm font-medium leading-5 text-orange-600 sm:text-base">
          {dateRange}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs font-medium leading-4 text-muted-foreground sm:text-sm">
          {venue}
        </p>
      </div>
    </Card>
  )
}

