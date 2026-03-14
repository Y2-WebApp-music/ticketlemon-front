import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TicketTypeCard } from "@/features/ticket-type"
import type { ChooseTicketOption } from "@/types/event"
import { ChevronUp, Ticket } from "lucide-react"

export interface ChooseTicketSessionWithRemaining {
  session_label: string
  tickets: (ChooseTicketOption & { remaining: number })[]
}

export interface SessionBlockProps {
  session: ChooseTicketSessionWithRemaining
  quantities: Record<string, number>
  onQuantityChange: (ticketId: string, qty: number) => void
}

export function SessionBlock({
  session,
  quantities,
  onQuantityChange,
}: SessionBlockProps) {
  return (
    <Collapsible defaultOpen className="space-y-3">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl bg-primary px-5 py-4 text-left text-white transition-opacity hover:opacity-95">
        <div className="flex items-center gap-2">
          <Ticket className="size-6 shrink-0" aria-hidden />
          <span className="text-lg font-medium">{session.session_label}</span>
        </div>
        <ChevronUp className="size-6 shrink-0" aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3">
        {session.tickets.map((ticket) =>
          ticket.remaining === 0 ? (
            <TicketTypeCard
              key={ticket.id}
              variant="soldOut"
              title={ticket.title}
              description={ticket.description}
              price={ticket.price}
            />
          ) : (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              quantity={quantities[ticket.id] ?? 0}
              onQuantityChange={(qty) => onQuantityChange(ticket.id, qty)}
            />
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export interface TicketRowProps {
  ticket: ChooseTicketOption
  quantity: number
  onQuantityChange: (qty: number) => void
}

export function TicketRow({
  ticket,
  quantity,
  onQuantityChange,
}: TicketRowProps) {
  const props =
    quantity > 0
      ? {
          variant: "selected" as const,
          title: ticket.title,
          description: ticket.description,
          price: ticket.price,
          quantity,
          onQuantityChange,
        }
      : {
          variant: "default" as const,
          title: ticket.title,
          description: ticket.description,
          price: ticket.price,
          quantity: 0,
          onQuantityChange,
        }
  return <TicketTypeCard {...props} />
}
