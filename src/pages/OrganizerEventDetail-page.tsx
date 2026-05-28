import { PageLayout } from "@/components/layouts/page-layout"
import {
  OrganizerEventHero,
  OrganizerEventTabs,
} from "@/features/organizer-dashboard"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import { getEventById } from "@/services/eventService"
import {
  DEFAULT_SELLING_TICKET_SELECTION,
  MOCK_SELLING_TABLE_RESPONSE,
} from "@/mocks/organizer-event-selling"
import type { EventTicketType, OrganizerEventDetail } from "@/types/event"
import type { SellingTicketSelection } from "@/types/organizer"
import { formatDateLabel } from "@/utils/formatDate"
import type { OutputData } from "@editorjs/editorjs"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  const [eventData, setEventData] = useState<OrganizerEventDetail | undefined>()
  const [openingSellingTicket, setOpeningSellingTicket] =
    useState<SellingTicketSelection | null>(null)
  const [descriptionOverrides, setDescriptionOverrides] = useState<
    Record<string, OutputData>
  >({})

  useEffect(() => {
    const toOutputData = (raw: string | null): OutputData => {
      if (!raw) return { time: Date.now(), version: "2.31.0", blocks: [] }
      try {
        const parsed = JSON.parse(raw) as OutputData
        if (parsed && Array.isArray(parsed.blocks)) return parsed
      } catch {
        // fallback to paragraph
      }
      return {
        time: Date.now(),
        version: "2.31.0",
        blocks: [{ type: "paragraph", data: { text: raw } }],
      }
    }

    const load = async () => {
      try {
        const apiEvent = await getEventById(eventId)
        const eventDateMap = new Map(
          apiEvent.event_date_entries.map((entry) => [
            entry.id,
            entry.start_date,
          ])
        )
        const saleDateMap = new Map(
          apiEvent.sale_date_entries.map((entry) => [
            entry.id,
            entry.start_date,
          ])
        )
        const ticketTypes: EventTicketType[] = apiEvent.ticket_types.map(
          (ticket) => {
            const total = Number(ticket.quantity) || 0
            return {
              id: ticket.id,
              title: ticket.name,
              description: ticket.detail ?? undefined,
              price: String(ticket.price),
              total,
              remaining: total,
              start_sale_date:
                saleDateMap.get(ticket.sale_ticket_on) ??
                apiEvent.sale_date_entries[0]?.start_date ??
                "",
              end_sale_date: null,
              event_date:
                eventDateMap.get(ticket.use_for_event_date_time) ??
                apiEvent.event_date_entries[0]?.start_date ??
                "",
              sold_out_date: null,
            }
          }
        )

        setEventData({
          id: apiEvent.id,
          status_id: 0,
          status_label: "",
          title: apiEvent.event_name,
          poster_url: apiEvent.poster_url ?? "",
          thumbnail_url: apiEvent.thumbnail_url ?? "",
          event_date_entries: apiEvent.event_date_entries.map(
            (entry) => entry.start_date
          ),
          venue: apiEvent.venue,
          age_restriction: apiEvent.age_restriction,
          sale_date_entries: apiEvent.sale_date_entries.map(
            (entry) => entry.start_date
          ),
          description: toOutputData(apiEvent.description),
          ticket_types: ticketTypes,
          staff_code: apiEvent.staff_code ?? "",
        })
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load event"
        toast.error(message)
        setEventData(undefined)
      }
    }

    load()
  }, [eventId])

  if (!eventData) {
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
        <OrganizerEventHero
          event={eventData}
          onSeeSelling={() =>
            setOpeningSellingTicket({ ...DEFAULT_SELLING_TICKET_SELECTION })
          }
        />
        <OrganizerEventTabs
          eventId={eventData.id}
          description={
            descriptionOverrides[eventData.id] ?? eventData.description
          }
          ticketGroups={groupTicketTypesByEventDate(eventData.ticket_types)}
          sellingTableResponse={MOCK_SELLING_TABLE_RESPONSE}
          showDateList={eventData.event_date_entries}
          ticketTypes={eventData.ticket_types}
          openingSellingTicket={openingSellingTicket}
          onDescriptionSave={(data) =>
            setDescriptionOverrides((prev) => ({
              ...prev,
              [eventData.id]: data,
            }))
          }
        />
      </div>
    </PageLayout>
  )
}
