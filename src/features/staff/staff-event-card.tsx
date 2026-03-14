import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StaffEventCardProps {
  title: string
  date_range: string
  venue: string
  image_url: string
  image_alt?: string
  /** Highlight current event with primary shadow and border */
  highlight?: boolean
  className?: string
}

export function StaffEventCard({
  title,
  date_range,
  venue,
  image_url,
  image_alt = "",
  highlight = false,
  className,
}: StaffEventCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "flex h-auto w-full flex-row items-stretch gap-0 rounded-xl bg-card p-0 shadow-[0_0_6px_0_rgba(0,0,0,0.09)] data-[size=sm]:gap-0 data-[size=sm]:py-0 sm:flex-row",
        "transition-shadow duration-200",
        highlight &&
          "border-orange-300 shadow-[0_0_6px_0_rgba(249,115,22,0.7)]",
        className
      )}
    >
      <div className="relative w-[120px] shrink-0 self-stretch overflow-hidden rounded-l-xl bg-muted sm:w-[120px] sm:rounded-t-none sm:rounded-l-xl">
        <img
          src={image_url}
          alt={image_alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-2">
        <p className="line-clamp-2 text-sm leading-6 font-medium text-foreground sm:text-base">
          {title}
        </p>
        <p className="mt-1 text-sm leading-5 font-medium text-orange-600 sm:text-base">
          {date_range}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs leading-4 font-medium text-muted-foreground sm:text-sm">
          {venue}
        </p>
      </div>
    </Card>
  )
}
