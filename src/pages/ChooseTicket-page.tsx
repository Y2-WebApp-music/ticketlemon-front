import { PageLayout } from "@/components/layouts"
import { ChooseTicketFooter, SessionBlock } from "@/features/choose-ticket"
import { getEventDetail } from "@/mocks/event-detail"
import type { EventTicketType } from "@/types/event"
import { formatDateLabel } from "@/utils/formatDate"
import { ChevronLeft } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"
import type { PurchaseOrderItem } from "@/features/purchase"

function parsePriceToNumber(price: string): number {
  const n = parseInt(price.replace(/[,\s]/g, ""), 10)
  return Number.isNaN(n) ? 0 : n
}

interface SessionWithRemaining {
  sessionLabel: string
  tickets: {
    id: string
    title: string
    description?: string
    price: string
    priceValue: number
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
      sessionLabel: formatDateLabel(eventDate),
      tickets: list.map((tt) => ({
        id: tt.id,
        title: tt.title,
        description: tt.description,
        price: tt.price,
        priceValue: parsePriceToNumber(tt.price),
        remaining: tt.remaining,
      })),
    }))
    .filter((s) => s.tickets.length > 0)
}

export interface ChooseTicketPageProps {
  eventId: string
}

export default function ChooseTicketPage({ eventId }: ChooseTicketPageProps) {
  const event = getEventDetail(eventId)
  const sessions = useMemo(
    () => (event ? buildSessionsFromTicketTypes(event.ticketTypes) : []),
    [event]
  )

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const updateQuantity = useCallback((ticketId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [ticketId]: Math.max(0, qty) }))
  }, [])

  const { total, totalTickets, summaryLines, orderItems } = useMemo(() => {
    let total = 0
    let totalTickets = 0
    const lines: string[] = []
    const orderItems: PurchaseOrderItem[] = []
    sessions.forEach((session) => {
      session.tickets.forEach((t) => {
        if (t.remaining <= 0) return
        const qty = quantities[t.id] ?? 0
        if (qty > 0) {
          const lineTotal = t.priceValue * qty
          total += lineTotal
          totalTickets += qty
          lines.push(`x${qty} ${t.title} (${session.sessionLabel})`)
          orderItems.push({
            title: t.title,
            sessionLabel: session.sessionLabel,
            price: t.price,
            priceValue: t.priceValue,
            qty,
            lineTotal,
          })
        }
      })
    })
    return {
      total,
      totalTickets,
      summaryLines: lines,
      orderItems,
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
      <div className="min-h-screen bg-muted/30 pb-[260px]">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
          <Link
            to="/events/$eventId"
            params={{ eventId }}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-6" aria-hidden />
            Back
          </Link>

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
          totalTickets={totalTickets}
          summaryLines={summaryLines}
          orderItems={orderItems}
        />
      </div>
    </PageLayout>
  )
}
