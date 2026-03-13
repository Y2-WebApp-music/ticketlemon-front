import { PageLayout } from "@/components/layouts/page-layout"
import {
  OrganizerEventHero,
  OrganizerEventTabs,
} from "@/features/organizer-dashboard"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import { getEventDetail } from "@/mocks/event-detail"
import type { EventTicketType } from "@/types/event"
import { formatDateLabel } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"

/** Organizer: notOnSale = now < start_sale_date; available = remaining > 0 && now > start_sale_date; saleEnd = remaining === 0 */
function mapOrganizerTicketTypesToCardProps(
  ticketTypes: EventTicketType[]
): TicketTypeCardProps[] {
  const now = Date.now()
  return ticketTypes.map((tt): TicketTypeCardProps => {
    const start = new Date(tt.start_sale_date).getTime()
    if (start > now) {
      return {
        variant: "notOnSale",
        title: tt.title,
        description: tt.description,
        price: tt.price,
        saleStartLabel: formatDateLabel(tt.start_sale_date),
      }
    }
    if (tt.remaining === 0) {
      return {
        variant: "saleEnd",
        title: tt.title,
        description: tt.description,
        price: tt.price,
        saleEndLabel: tt.end_sale_date
          ? formatDateLabel(tt.end_sale_date)
          : tt.sold_out_date
            ? formatDateLabel(tt.sold_out_date)
            : "—",
        onExportData: () => console.log("Export data"),
      }
    }
    return {
      variant: "available",
      title: tt.title,
      description: tt.description,
      price: tt.price,
      remaining: tt.remaining,
    }
  })
}

interface TicketTypeGroup {
  sessionLabel: string
  tickets: TicketTypeCardProps[]
}

function groupTicketTypesByEventDate(
  ticketTypes: EventTicketType[]
): TicketTypeGroup[] {
  const byDate = new Map<string, EventTicketType[]>()
  for (const tt of ticketTypes) {
    const key = tt.event_date
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(tt)
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([eventDate, list]) => ({
      sessionLabel: formatDateLabel(eventDate),
      tickets: mapOrganizerTicketTypesToCardProps(list),
    }))
}

export interface OrganizerEventDetailPageProps {
  eventId: string
}

export default function OrganizerEventDetailPage({
  eventId,
}: OrganizerEventDetailPageProps) {
  const event = getEventDetail(eventId)

  if (!event) {
    return (
      <PageLayout>
        <main className="flex min-h-[50vh] flex-col items-center justify-center px-4">
          <p className="text-muted-foreground">Event not found.</p>
          <Link to="/organizer" className="mt-4 text-primary hover:underline">
            Back to dashboard
          </Link>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-muted/30">
        {/* <div className="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6">
          <Link
            to="/organizer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div> */}
        <OrganizerEventHero event={event} />
        <OrganizerEventTabs
          eventId={event.id}
          description={event.description}
          ticketGroups={groupTicketTypesByEventDate(event.ticketTypes)}
        />
      </div>
    </PageLayout>
  )
}
