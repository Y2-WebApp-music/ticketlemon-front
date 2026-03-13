import { PageLayout } from "@/components/layouts"
import { EventHero, EventTabs, type TicketTypeGroup } from "@/features/event-detail"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import { getEventDetail } from "@/mocks/event-detail"
import type { EventTicketType } from "@/types/event"
import { formatDateLabel } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"

/** Event detail: available = remaining > 0 && now > start_sale_date; soldOut = remaining === 0; notOnSale = now < start_sale_date */
function mapTicketTypesToCardProps(
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
        variant: "soldOut",
        title: tt.title,
        description: tt.description,
        price: tt.price,
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
    .map(([eventDate, list]): TicketTypeGroup => ({
      sessionLabel: formatDateLabel(eventDate),
      tickets: mapTicketTypesToCardProps(list),
    }))
}

export interface EventDetailPageProps {
  eventId: string
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const event = getEventDetail(eventId)

  if (!event) {
    return (
      <PageLayout>
        <main className="flex min-h-[50vh] flex-col items-center justify-center px-4">
          <p className="text-muted-foreground">Event not found.</p>
          <Link to="/" className="mt-4 text-primary hover:underline">
            Back to home
          </Link>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="relative min-h-screen bg-muted/30">
        <EventHero
          eventId={event.id}
          title={event.title}
          imageUrl={event.poster_url}
          show_date_list={event.show_date_list}
          venue={event.venue}
        />
        <EventTabs
          eventId={event.id}
          description={event.description}
          ticketGroups={groupTicketTypesByEventDate(event.ticketTypes)}
        />
      </div>
    </PageLayout>
  )
}
