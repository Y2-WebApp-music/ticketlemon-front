import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, Upload } from "lucide-react"
import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { TABLE_VIEW_PAGE_SIZE_OPTIONS } from "@/constants/organizer-event-sort.constant"
import { formatDateLabel } from "@/utils/formatDate"
import type {
  CheckInTableResponse,
  EventCheckInQueryParams,
} from "@/types/organizer"

const ALL_FILTER_VALUE = "all"

export interface OrganizerEventCheckInTableProps {
  checkInTableResponse: CheckInTableResponse
  isLoading?: boolean
  onBack: () => void
  onQueryChange: (params: EventCheckInQueryParams) => void
}

export function OrganizerEventCheckInTable({
  checkInTableResponse,
  isLoading = false,
  onBack,
  onQueryChange,
}: OrganizerEventCheckInTableProps) {
  const rows = checkInTableResponse.data
  const { total, page: currentPage, perPage } = checkInTableResponse
  const eventDateEntries = checkInTableResponse.event_date_entries
  const ticketTypes = checkInTableResponse.ticket_types

  const [nameQuery, setNameQuery] = useState("")
  const [eventRoundFilter, setEventRoundFilter] = useState(ALL_FILTER_VALUE)
  const [ticketTypeFilter, setTicketTypeFilter] = useState(ALL_FILTER_VALUE)

  const eventRoundOptions = useMemo(
    () =>
      eventDateEntries.map((entry) => ({
        id: entry.id,
        label: formatDateLabel(entry.start_date),
      })),
    [eventDateEntries]
  )

  const ticketTypeOptionsByRound = useMemo(() => {
    const map = new Map<string, Array<{ id: string; name: string }>>()
    for (const ticketType of ticketTypes) {
      const roundEntry = eventDateEntries.find(
        (entry) => entry.id === ticketType.use_for_event_date_time
      )
      if (!roundEntry) continue
      const roundLabel = formatDateLabel(roundEntry.start_date)
      const list = map.get(roundLabel) ?? []
      if (!list.some((item) => item.id === ticketType.id)) {
        list.push({ id: ticketType.id, name: ticketType.name })
      }
      map.set(roundLabel, list)
    }
    return map
  }, [eventDateEntries, ticketTypes])

  const allTicketTypeOptions = useMemo(
    () =>
      ticketTypes.map((ticketType) => ({
        id: ticketType.id,
        name: ticketType.name,
      })),
    [ticketTypes]
  )

  const ticketTypeOptions = useMemo(() => {
    if (eventRoundFilter === ALL_FILTER_VALUE) {
      return allTicketTypeOptions
    }
    return (
      ticketTypeOptionsByRound.get(eventRoundFilter) ?? allTicketTypeOptions
    )
  }, [allTicketTypeOptions, eventRoundFilter, ticketTypeOptionsByRound])

  const effectiveEventRoundFilter = eventRoundOptions.some(
    (round) => round.label === eventRoundFilter
  )
    ? eventRoundFilter
    : ALL_FILTER_VALUE
  const effectiveTicketTypeFilter = ticketTypeOptions.some(
    (ticketType) => ticketType.name === ticketTypeFilter
  )
    ? ticketTypeFilter
    : ALL_FILTER_VALUE

  const buildQuery = (
    overrides: Partial<EventCheckInQueryParams> = {}
  ): EventCheckInQueryParams => {
    const selectedRound = eventRoundOptions.find(
      (round) => round.label === effectiveEventRoundFilter
    )
    const selectedTicketType = ticketTypeOptions.find(
      (ticketType) => ticketType.name === effectiveTicketTypeFilter
    )

    return {
      page: currentPage,
      per_page: perPage,
      search: nameQuery.trim() || undefined,
      event_date_entry_id:
        effectiveEventRoundFilter === ALL_FILTER_VALUE
          ? undefined
          : selectedRound?.id,
      ticket_type_id:
        effectiveTicketTypeFilter === ALL_FILTER_VALUE
          ? undefined
          : selectedTicketType?.id,
      ...overrides,
    }
  }

  const applyQuery = (overrides: Partial<EventCheckInQueryParams> = {}) => {
    onQueryChange(buildQuery(overrides))
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const displayStart = total === 0 ? 0 : (safePage - 1) * perPage + 1
  const displayEnd = total === 0 ? 0 : Math.min(safePage * perPage, total)
  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1)
    }
    if (safePage <= 3) return [1, 2, 3, "...", totalPages] as const
    if (safePage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages] as const
    }
    return [1, "...", safePage, "...", totalPages] as const
  }, [safePage, totalPages])

  return (
    <div className="space-y-4 rounded-xl bg-card p-4 ring-1 ring-border sm:p-6">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        onClick={onBack}
      >
        <ChevronLeft className="size-4" />
        Back
      </button>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,160px))_auto_auto] lg:items-end">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            placeholder="Search name"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyQuery({ page: 1 })
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>
            Event Round <span className="text-destructive">*</span>
          </Label>
          <Select
            value={effectiveEventRoundFilter}
            onValueChange={(value) => {
              setEventRoundFilter(value)
              const selectedRound = eventRoundOptions.find(
                (round) => round.label === value
              )
              applyQuery({
                page: 1,
                event_date_entry_id:
                  value === ALL_FILTER_VALUE ? undefined : selectedRound?.id,
              })
            }}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
              {eventRoundOptions.map((eventRound) => (
                <SelectItem key={eventRound.id} value={eventRound.label}>
                  {eventRound.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>
            Ticket Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={effectiveTicketTypeFilter}
            onValueChange={(value) => {
              setTicketTypeFilter(value)
              const selectedType = ticketTypeOptions.find(
                (ticketType) => ticketType.name === value
              )
              applyQuery({
                page: 1,
                ticket_type_id:
                  value === ALL_FILTER_VALUE ? undefined : selectedType?.id,
              })
            }}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
              {ticketTypeOptions.map((ticketType) => (
                <SelectItem key={ticketType.id} value={ticketType.name}>
                  {ticketType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => applyQuery({ page: 1 })}
        >
          Search
        </Button>
        <Button type="button" variant="outline" className="rounded-lg">
          <Upload className="size-4" />
          Export
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-12 px-4">Name</TableHead>
              <TableHead className="h-12 px-4">Email</TableHead>
              <TableHead className="h-12 px-4">Event Round</TableHead>
              <TableHead className="h-12 px-4">Ticket Type</TableHead>
              <TableHead className="h-12 px-4">Check In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No check-in records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={`${row.email}-${row.checkInTime}-${index}`}>
                  <TableCell className="px-4">{row.name}</TableCell>
                  <TableCell className="px-4">{row.email}</TableCell>
                  <TableCell className="px-4">
                    {formatDateLabel(row.eventRound)}
                  </TableCell>
                  <TableCell className="px-4">{row.ticketType}</TableCell>
                  <TableCell className="px-4">
                    {dayjs(row.checkInTime).isValid()
                      ? dayjs(row.checkInTime).format("HH:mm:ss")
                      : row.checkInTime}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>{`Display ${displayStart}-${displayEnd} of ${total}`}</span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              applyQuery({ page: 1, per_page: Number(value) })
            }}
          >
            <SelectTrigger className="w-[64px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABLE_VIEW_PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  applyQuery({ page: Math.max(safePage - 1, 1) })
                }}
              />
            </PaginationItem>
            {visiblePages.map((value, index) =>
              value === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={value}>
                  <PaginationLink
                    href="#"
                    isActive={value === safePage}
                    onClick={(e) => {
                      e.preventDefault()
                      applyQuery({ page: value })
                    }}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  applyQuery({ page: Math.min(safePage + 1, totalPages) })
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
