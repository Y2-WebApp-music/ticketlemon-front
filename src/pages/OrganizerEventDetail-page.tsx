import { PageLayout } from "@/components/layouts/page-layout"
import {
  OrganizerEventHero,
  OrganizerEventTabs,
} from "@/features/organizer-dashboard"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import {
  getEventById,
  getEventCheckIn,
  getEventSelling,
  getEventSoldTicketCount,
  mapApiEventToTicketTypes,
  updateEvent,
} from "@/services/eventService"
import { DEFAULT_SELLING_TICKET_SELECTION } from "@/mocks/organizer-event-selling"
import type { EventTicketType, OrganizerEventDetail } from "@/types/event"
import type {
  CheckInTableResponse,
  EventCheckInQueryParams,
  EventSellingQueryParams,
  SellingTableResponse,
  SellingTicketSelection,
} from "@/types/organizer"
import { resolveEventStatus } from "@/constants/event-status.constant"
import { formatDateLabel } from "@/utils/formatDate"
import type { OutputData } from "@editorjs/editorjs"
import { Link } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"
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
  const [eventDateEntryIdByLabel, setEventDateEntryIdByLabel] = useState<
    Record<string, string>
  >({})
  const [sellingTableResponse, setSellingTableResponse] =
    useState<SellingTableResponse | null>(null)
  const [sellingTableLoading, setSellingTableLoading] = useState(false)
  const [checkInTableResponse, setCheckInTableResponse] =
    useState<CheckInTableResponse | null>(null)
  const [checkInTableLoading, setCheckInTableLoading] = useState(false)
  const [openingCheckInList, setOpeningCheckInList] = useState(0)
  const [checkInCount, setCheckInCount] = useState<number | null>(null)
  const [descriptionOverrides, setDescriptionOverrides] = useState<
    Record<string, OutputData>
  >({})

  const loadSellingTable = useCallback(
    async (params: EventSellingQueryParams) => {
      setSellingTableLoading(true)
      try {
        const response = await getEventSelling(eventId, params)
        setSellingTableResponse(response)
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load selling data"
        toast.error(message)
        setSellingTableResponse(null)
      } finally {
        setSellingTableLoading(false)
      }
    },
    [eventId]
  )

  const resolveSellingQuery = useCallback(
    (
      selection: SellingTicketSelection,
      overrides: EventSellingQueryParams = {}
    ): EventSellingQueryParams => {
      const ticketType = eventData?.ticket_types.find(
        (ticket) => ticket.title === selection.title
      )

      return {
        page: 1,
        per_page: 15,
        event_date_entry_id: eventDateEntryIdByLabel[selection.sessionLabel],
        ticket_type_id: ticketType?.id,
        ...overrides,
      }
    },
    [eventData?.ticket_types, eventDateEntryIdByLabel]
  )

  const handleSellingTicketSelect = useCallback(
    (selection: SellingTicketSelection) => {
      void loadSellingTable(resolveSellingQuery(selection))
    },
    [loadSellingTable, resolveSellingQuery]
  )

  const handleSellingQueryChange = useCallback(
    (params: EventSellingQueryParams) => {
      void loadSellingTable(params)
    },
    [loadSellingTable]
  )

  const loadCheckInTable = useCallback(
    async (params: EventCheckInQueryParams) => {
      setCheckInTableLoading(true)
      try {
        const response = await getEventCheckIn(eventId, params)
        setCheckInTableResponse(response)
        setCheckInCount(response.total)
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load check-in data"
        toast.error(message)
        setCheckInTableResponse(null)
      } finally {
        setCheckInTableLoading(false)
      }
    },
    [eventId]
  )

  const handleCheckInQueryChange = useCallback(
    (params: EventCheckInQueryParams) => {
      void loadCheckInTable(params)
    },
    [loadCheckInTable]
  )

  const handleSeeCheckIn = useCallback(() => {
    setOpeningCheckInList((key) => key + 1)
    void loadCheckInTable({ page: 1, per_page: 15 })
  }, [loadCheckInTable])

  const handleDescriptionSave = useCallback(
    async (data: OutputData) => {
      if (!eventData) return

      try {
        await updateEvent(eventData.id, { description: data })
        setEventData((prev) => (prev ? { ...prev, description: data } : prev))
        setDescriptionOverrides((prev) => {
          const next = { ...prev }
          delete next[eventData.id]
          return next
        })
        toast.success("Description saved")
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to save description"
        toast.error(message)
        throw error
      }
    },
    [eventData]
  )

  useEffect(() => {
    const toOutputData = (raw: unknown): OutputData => {
      if (!raw) return { time: Date.now(), version: "2.31.0", blocks: [] }

      if (typeof raw === "object" && raw !== null && "blocks" in raw) {
        const maybe = raw as Partial<OutputData>
        if (Array.isArray(maybe.blocks)) {
          return (
            (raw as OutputData) ?? {
              time: Date.now(),
              version: "2.31.0",
              blocks: [],
            }
          )
        }
      }

      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw) as OutputData
          if (parsed && Array.isArray(parsed.blocks)) return parsed
        } catch {
          // fallback to paragraph below
        }

        return {
          time: Date.now(),
          version: "2.31.0",
          blocks: [{ type: "paragraph", data: { text: raw } }],
        }
      }

      return { time: Date.now(), version: "2.31.0", blocks: [] }
    }

    const load = async () => {
      try {
        const [apiEvent, soldTickets, checkInSummary] = await Promise.all([
          getEventById(eventId),
          getEventSoldTicketCount(eventId),
          getEventCheckIn(eventId, { page: 1, per_page: 1 }).catch(() => null),
        ])
        const ticketTypes = mapApiEventToTicketTypes(
          apiEvent,
          soldTickets.by_ticket_type
        )

        const dateEntryIdByLabel: Record<string, string> = {}
        for (const entry of apiEvent.event_date_entries) {
          dateEntryIdByLabel[formatDateLabel(entry.start_date)] = entry.id
        }
        setEventDateEntryIdByLabel(dateEntryIdByLabel)
        setCheckInCount(checkInSummary?.total ?? null)

        const lastShowDate =
          apiEvent.event_date_entries[apiEvent.event_date_entries.length - 1]
            ?.start_date ?? ""

        setEventData({
          id: apiEvent.id,
          status: resolveEventStatus(apiEvent.status, lastShowDate),
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
          checkInCount={checkInCount}
          onSeeSelling={() =>
            setOpeningSellingTicket({ ...DEFAULT_SELLING_TICKET_SELECTION })
          }
          onSeeCheckIn={handleSeeCheckIn}
        />
        <OrganizerEventTabs
          eventId={eventData.id}
          description={
            descriptionOverrides[eventData.id] ?? eventData.description
          }
          ticketGroups={groupTicketTypesByEventDate(eventData.ticket_types)}
          sellingTableResponse={sellingTableResponse}
          sellingTableLoading={sellingTableLoading}
          onSellingQueryChange={handleSellingQueryChange}
          onSellingTicketSelect={handleSellingTicketSelect}
          openingSellingTicket={openingSellingTicket}
          checkInTableResponse={checkInTableResponse}
          checkInTableLoading={checkInTableLoading}
          onCheckInQueryChange={handleCheckInQueryChange}
          openingCheckInList={openingCheckInList}
          onDescriptionSave={handleDescriptionSave}
        />
      </div>
    </PageLayout>
  )
}
