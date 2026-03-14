import { PageLayout } from "@/components/layouts"
import { ChooseTicketFooter, SessionBlock } from "@/features/choose-ticket"
import {
  EventHero,
  EventTabs,
  type TicketTypeGroup,
} from "@/features/event-detail"
import type { PurchaseOrderItem } from "@/types/purchase"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import { getEventDetail } from "@/mocks/event-detail"
import type { EventTicketType } from "@/types/event"
import { formatDateLabel } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

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
    .map(
      ([eventDate, list]): TicketTypeGroup => ({
        sessionLabel: formatDateLabel(eventDate),
        tickets: mapTicketTypesToCardProps(list),
      })
    )
}

function parsePriceToNumber(price: string): number {
  const n = parseInt(price.replace(/[,\s]/g, ""), 10)
  return Number.isNaN(n) ? 0 : n
}

interface SessionWithRemaining {
  session_label: string
  tickets: {
    id: string
    title: string
    description?: string
    price: string
    price_value: number
    remaining: number
  }[]
}

function buildSessionsFromTicketTypes(
  ticketTypes: EventTicketType[]
): SessionWithRemaining[] {
  const now = Date.now()
  const byDate = new Map<string, EventTicketType[]>()
  for (const tt of ticketTypes) {
    if (new Date(tt.start_sale_date).getTime() > now) continue
    const key = tt.event_date
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(tt)
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([eventDate, list]) => ({
      session_label: formatDateLabel(eventDate),
      tickets: list.map((tt) => ({
        id: tt.id,
        title: tt.title,
        description: tt.description,
        price: tt.price,
        price_value: parsePriceToNumber(tt.price),
        remaining: tt.remaining,
      })),
    }))
    .filter((s) => s.tickets.length > 0)
}

export interface EventDetailPageProps {
  eventId: string
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [event, setEvent] = useState<ReturnType<typeof getEventDetail>>()
  const [step, setStep] = useState<"detail" | "choose">("detail")
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    // Placeholder for future API fetch.
    setEvent(getEventDetail(eventId))
  }, [eventId])

  const sessions = useMemo(
    () => buildSessionsFromTicketTypes(event?.ticket_types ?? []),
    [event?.ticket_types]
  )

  const updateQuantity = useCallback((ticketId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [ticketId]: Math.max(0, qty) }))
  }, [])

  const { total, total_tickets, summary_lines, order_items } = useMemo(() => {
    let total = 0
    let totalTickets = 0
    const lines: string[] = []
    const orderItems: PurchaseOrderItem[] = []

    sessions.forEach((session) => {
      session.tickets.forEach((t) => {
        if (t.remaining <= 0) return
        const qty = quantities[t.id] ?? 0
        if (qty > 0) {
          const lineTotal = t.price_value * qty
          total += lineTotal
          totalTickets += qty
          lines.push(`x${qty} ${t.title} (${session.session_label})`)
          orderItems.push({
            title: t.title,
            session_label: session.session_label,
            price: t.price,
            price_value: t.price_value,
            qty,
            line_total: lineTotal,
          })
        }
      })
    })

    return {
      total,
      total_tickets: totalTickets,
      summary_lines: lines,
      order_items: orderItems,
    }
  }, [sessions, quantities])

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
      {step === "detail" ? (
        <div className="relative min-h-screen bg-muted/30">
          <EventHero
            title={event.title}
            imageUrl={event.poster_url}
            show_date_list={event.show_date_list}
            venue={event.venue}
            onBuyTickets={() => setStep("choose")}
          />
          <EventTabs
            description={event.description}
            ticketGroups={groupTicketTypesByEventDate(event.ticket_types)}
            onChooseTickets={() => setStep("choose")}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-muted/30 pb-[260px]">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
            <button
              type="button"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              onClick={() => setStep("detail")}
            >
              <ChevronLeft className="size-6" aria-hidden />
              Back
            </button>

            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight text-primary">
                Select Ticket
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                {event.title}
              </p>
            </div>

            <div className="space-y-6">
              {sessions.map((session, sessionIndex) => (
                <SessionBlock
                  key={sessionIndex}
                  session={session}
                  quantities={quantities}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </div>
          </div>

          <ChooseTicketFooter
            eventId={event.id}
            total={total}
            totalTickets={total_tickets}
            summaryLines={summary_lines}
            orderItems={order_items}
            buyDisabled={total_tickets === 0}
          />
        </div>
      )}
    </PageLayout>
  )
}
