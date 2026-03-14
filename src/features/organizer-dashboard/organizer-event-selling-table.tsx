import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  TABLE_VIEW_PAGE_SIZE_OPTIONS,
  TABLE_VIEW_STATUS_OPTIONS,
} from "@/constants/organizer-event-sort.constant"
import { formatDateLabel } from "@/utils/formatDate"
import type { EventTicketType } from "@/types/event"
import type { SellingTableResponse } from "@/types/organizer"

const ALL_FILTER_VALUE = "all"

export interface OrganizerSellingTicketSelection {
  sessionLabel: string
  title: string
}

export interface OrganizerEventSellingTableProps {
  selectedTicket: OrganizerSellingTicketSelection
  sellingTableResponse: SellingTableResponse
  showDateList: string[]
  ticketTypes: EventTicketType[]
  onBack: () => void
}

export function OrganizerEventSellingTable({
  selectedTicket,
  sellingTableResponse,
  showDateList,
  ticketTypes,
  onBack,
}: OrganizerEventSellingTableProps) {
  type StatusFilterValue = (typeof TABLE_VIEW_STATUS_OPTIONS)[number]["value"]

  const [page, setPage] = useState(sellingTableResponse.page)
  const [perPage, setPerPage] = useState(sellingTableResponse.perPage)
  const rows = sellingTableResponse.data
  const [nameQuery, setNameQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [eventRoundFilter, setEventRoundFilter] = useState(
    selectedTicket.sessionLabel
  )
  const [ticketTypeFilter, setTicketTypeFilter] = useState(selectedTicket.title)

  const eventRoundOptions = useMemo(() => {
    const seen = new Set<string>()
    return showDateList
      .map((date) => formatDateLabel(date))
      .filter((label) => {
        if (seen.has(label)) return false
        seen.add(label)
        return true
      })
  }, [showDateList])

  const ticketTypeOptionsByRound = useMemo(() => {
    const map = new Map<string, string[]>()
    ticketTypes.forEach((ticket) => {
      const roundLabel = formatDateLabel(ticket.event_date)
      const titles = map.get(roundLabel) ?? []
      if (!titles.includes(ticket.title)) {
        titles.push(ticket.title)
      }
      map.set(roundLabel, titles)
    })
    return map
  }, [ticketTypes])

  const allTicketTypeOptions = useMemo(() => {
    const seen = new Set<string>()
    return ticketTypes
      .map((ticket) => ticket.title)
      .filter((title) => {
        if (seen.has(title)) return false
        seen.add(title)
        return true
      })
  }, [ticketTypes])

  const ticketTypeOptions = useMemo(() => {
    if (eventRoundFilter === ALL_FILTER_VALUE) {
      return allTicketTypeOptions
    }
    return ticketTypeOptionsByRound.get(eventRoundFilter) ?? []
  }, [allTicketTypeOptions, eventRoundFilter, ticketTypeOptionsByRound])

  const effectiveEventRoundFilter = eventRoundOptions.includes(eventRoundFilter)
    ? eventRoundFilter
    : ALL_FILTER_VALUE
  const effectiveTicketTypeFilter = ticketTypeOptions.includes(ticketTypeFilter)
    ? ticketTypeFilter
    : ALL_FILTER_VALUE

  const filteredRows = useMemo(() => {
    const query = nameQuery.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesName =
        query.length === 0 || row.name.toLowerCase().includes(query)
      const matchesStatus =
        statusFilter === ALL_FILTER_VALUE || row.status === statusFilter
      const matchesEventRound =
        effectiveEventRoundFilter === ALL_FILTER_VALUE ||
        formatDateLabel(row.eventRound) === effectiveEventRoundFilter
      const matchesTicketType =
        effectiveTicketTypeFilter === ALL_FILTER_VALUE ||
        row.ticketType === effectiveTicketTypeFilter
      return (
        matchesName && matchesStatus && matchesEventRound && matchesTicketType
      )
    })
  }, [
    effectiveEventRoundFilter,
    effectiveTicketTypeFilter,
    nameQuery,
    rows,
    statusFilter,
  ])

  const total = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const displayStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const displayEnd = total === 0 ? 0 : Math.min(currentPage * perPage, total)
  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1)
    }
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages] as const
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages] as const
    }
    return [1, "...", currentPage, "...", totalPages] as const
  }, [currentPage, totalPages])
  const pagedRows = useMemo(
    () =>
      filteredRows.slice((currentPage - 1) * perPage, currentPage * perPage),
    [currentPage, filteredRows, perPage]
  )

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

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,160px))_auto] lg:items-end">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            placeholder="Search name"
            value={nameQuery}
            onChange={(e) => {
              setNameQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as StatusFilterValue)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABLE_VIEW_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Event Round</Label>
          <Select
            value={effectiveEventRoundFilter}
            onValueChange={(value) => {
              setEventRoundFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
              {eventRoundOptions.map((eventRound) => (
                <SelectItem key={eventRound} value={eventRound}>
                  {eventRound}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Ticket Type</Label>
          <Select
            value={effectiveTicketTypeFilter}
            onValueChange={(value) => {
              setTicketTypeFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
              {ticketTypeOptions.map((ticketType) => (
                <SelectItem key={ticketType} value={ticketType}>
                  {ticketType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" className="rounded-lg">
          <Upload className="size-4" />
          Export Table
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-12 px-4">Name</TableHead>
              <TableHead className="h-12 px-4">Email</TableHead>
              <TableHead className="h-12 px-4">Status</TableHead>
              <TableHead className="h-12 px-4">Event Round</TableHead>
              <TableHead className="h-12 px-4">Ticket Type</TableHead>
              <TableHead className="h-12 px-4">Booking time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.map((row, index) => (
              <TableRow key={`${row.email}-${index}`}>
                <TableCell className="px-4">{row.name}</TableCell>
                <TableCell className="px-4">{row.email}</TableCell>
                <TableCell className="px-4">
                  <Badge
                    variant={row.status === "purchased" ? "pass" : "warning"}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4">
                  {formatDateLabel(row.eventRound)}
                </TableCell>
                <TableCell className="px-4">{row.ticketType}</TableCell>
                <TableCell className="px-4">
                  {dayjs(row.bookingTime).isValid()
                    ? dayjs(row.bookingTime).format("D MMM YY, HH:mm:ss")
                    : row.bookingTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>{`Display ${displayStart}-${displayEnd} of ${total}`}</span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              setPerPage(Number(value))
              setPage(1)
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
                  setPage((prev) => Math.max(prev - 1, 1))
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
                    isActive={value === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(value)
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
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
