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
import {
  MOCK_SELLING_TABLE_RESPONSE,
  TABLE_VIEW_PAGE_SIZE_OPTIONS,
} from "@/mocks/organizer-event-selling"
import { ChevronLeft, Upload } from "lucide-react"
import { useMemo, useState } from "react"

export interface OrganizerSellingTicketSelection {
  sessionLabel: string
  title: string
}

export interface OrganizerEventSellingTableProps {
  selectedTicket: OrganizerSellingTicketSelection
  onBack: () => void
}

export function OrganizerEventSellingTable({
  selectedTicket,
  onBack,
}: OrganizerEventSellingTableProps) {
  const [page, setPage] = useState(MOCK_SELLING_TABLE_RESPONSE.page)
  const [perPage, setPerPage] = useState(MOCK_SELLING_TABLE_RESPONSE.perPage)
  const total = MOCK_SELLING_TABLE_RESPONSE.total
  const rows = MOCK_SELLING_TABLE_RESPONSE.data

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
          <Input placeholder="Search name" />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Event Round</Label>
          <Select>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={selectedTicket.sessionLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={selectedTicket.sessionLabel}>
                {selectedTicket.sessionLabel}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Ticket Type</Label>
          <Select>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={selectedTicket.title} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={selectedTicket.title}>
                {selectedTicket.title}
              </SelectItem>
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
            {rows.map((row, index) => (
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
                <TableCell className="px-4">{row.eventRound}</TableCell>
                <TableCell className="px-4">{row.ticketType}</TableCell>
                <TableCell className="px-4">{row.bookingTime}</TableCell>
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
