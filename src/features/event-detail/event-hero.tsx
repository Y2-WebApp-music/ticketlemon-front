import { Button } from "@/components/ui/button"
import { formatDateLabel } from "@/utils/formatDate"
import { CalendarRange, MapPin, Ticket, Users } from "lucide-react"
import { Link } from "@tanstack/react-router"

export interface EventHeroProps {
  eventId: string
  title: string
  imageUrl: string
  show_date_list: string[]
  venue: string
}

export function EventHero({
  eventId,
  title,
  imageUrl,
  show_date_list,
  venue,
}: EventHeroProps) {
  const formattedDates = show_date_list.map((iso) => formatDateLabel(iso))
  return (
    <>
      <div
        className="absolute top-0 h-[50vh] w-full blur-lg sm:blur-none"
        aria-hidden
      >
        <img
          src={"/src/assets/Thumbnail.png"}
          alt=""
          className="h-[700px] w-full object-cover sm:aspect-1500/360 sm:h-auto"
        />
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:pt-52">
        <div className="md:items-flex-start flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="mx-auto w-full max-w-[270px] shrink-0 md:mx-0">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <img
                src={imageUrl}
                alt=""
                className="aspect-200/300 w-full object-cover"
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h1 className="text-xl leading-7 font-normal text-foreground sm:text-2xl">
                {title}
              </h1>
            </div>
            <div className="flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CalendarRange
                    className="size-6 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                    {formattedDates.map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin
                    className="size-6 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-sm text-muted-foreground">{venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users
                    className="size-6 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-sm text-muted-foreground">
                    No age restriction
                  </span>
                </div>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/events/$eventId/choose" params={{ eventId }}>
                  <Ticket className="size-5" aria-hidden />
                  Buy Tickets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
