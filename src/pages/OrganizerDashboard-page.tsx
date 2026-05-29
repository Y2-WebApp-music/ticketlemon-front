import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageLayout } from "@/components/layouts/page-layout"
import { OrganizerEventCard } from "@/features/organizer-dashboard"
import {
  ORGANIZER_EVENT_STATUS_FILTER_OPTIONS,
  resolveEventStatus,
  type OrganizerEventStatusFilterValue,
} from "@/constants/event-status.constant"
import {
  ORGANIZER_EVENT_SORT_OPTIONS,
  type OrganizerEventSortValue,
} from "@/constants/organizer-event-sort.constant"
import type { OrganizerEvent } from "@/types"
import type { ApiEvent } from "@/types/api-response"
import { getEventsByCreateById } from "@/services/eventService"
import { useUserStore } from "@/stores/user-store"
import { Plus } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

function mapApiEventToOrganizerEvent(event: ApiEvent): OrganizerEvent {
  const showStartDate = event.event_date_entries[0]?.start_date ?? ""
  const showEndDate =
    event.event_date_entries[event.event_date_entries.length - 1]?.start_date ??
    showStartDate
  const showBeginLabel = showStartDate
    ? `Show begin ${new Date(showStartDate).toLocaleString()}`
    : "No schedule"

  return {
    event_id: event.id,
    image_url: event.poster_url ?? "",
    show_start_date: showStartDate,
    show_end_date: showEndDate,
    title: event.event_name,
    venue: event.venue,
    status: resolveEventStatus(event.status, showEndDate),
    bottom_line: showBeginLabel,
  }
}

function sortOrganizerEvents(
  events: OrganizerEvent[],
  sort: OrganizerEventSortValue
): OrganizerEvent[] {
  const sorted = [...events]
  switch (sort) {
    case "date_asc":
      return sorted.sort((a, b) =>
        a.show_start_date.localeCompare(b.show_start_date)
      )
    case "date_desc":
      return sorted.sort((a, b) =>
        b.show_start_date.localeCompare(a.show_start_date)
      )
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

export default function OrganizerDashboardPage() {
  const userId = useUserStore((state) => state.user_id)
  const orgName = useUserStore((state) => state.org_name)
  const firstName = useUserStore((state) => state.first_name)
  const lastName = useUserStore((state) => state.last_name)
  const email = useUserStore((state) => state.email)

  const [comingEventsState, setComingEventsState] = useState<OrganizerEvent[]>(
    []
  )
  const [allEventsState, setAllEventsState] = useState<OrganizerEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<OrganizerEventStatusFilterValue>("all")
  const [sortValue, setSortValue] =
    useState<OrganizerEventSortValue>("date_asc")

  const organizerNameState = useMemo(() => {
    if (orgName?.trim()) return orgName.trim()
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
    if (fullName) return fullName
    return email ?? "Organizer"
  }, [email, firstName, lastName, orgName])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)
    return () => window.clearTimeout(timerId)
  }, [searchQuery])

  const loadEvents = useCallback(async () => {
    if (!userId) {
      setComingEventsState([])
      setAllEventsState([])
      return
    }

    setIsLoading(true)
    try {
      const events = await getEventsByCreateById(userId, {
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      })

      const mapped = events.map(mapApiEventToOrganizerEvent)
      const sorted = sortOrganizerEvents(mapped, sortValue)
      const now = Date.now()
      const coming = sorted.filter((event) => {
        if (!event.show_start_date) return false
        return new Date(event.show_start_date).getTime() >= now
      })

      setComingEventsState(coming)
      setAllEventsState(sorted)
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to load organizer events"
      toast.error(message)
      setComingEventsState([])
      setAllEventsState([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, sortValue, statusFilter, userId])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto max-w-[1264px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl leading-7 font-normal text-primary">
                My Event
              </h1>
              <Button asChild>
                <Link to="/organizer/create">
                  <Plus className="size-4" />
                  Create Event
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {organizerNameState}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1 space-y-1.5">
              <Label htmlFor="organizer-search" className="text-sm">
                Event Name
              </Label>
              <Input
                id="organizer-search"
                type="search"
                placeholder="Search event."
                className="rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-[190px] space-y-1.5">
              <Label className="text-sm">
                Event Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as OrganizerEventStatusFilterValue)
                }
              >
                <SelectTrigger
                  id="organizer-status"
                  className="w-full rounded-lg"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZER_EVENT_STATUS_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[190px] space-y-1.5">
              <Label className="text-sm">
                Event Sort <span className="text-destructive">*</span>
              </Label>
              <Select
                value={sortValue}
                onValueChange={(value) =>
                  setSortValue(value as OrganizerEventSortValue)
                }
              >
                <SelectTrigger
                  id="organizer-sort"
                  className="w-full rounded-lg"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZER_EVENT_SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!userId && (
            <p className="text-sm text-muted-foreground">
              Sign in as an organizer to view your events.
            </p>
          )}

          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          )}

          <section className="flex flex-col gap-4">
            <h2 className="text-xl leading-7 font-normal text-foreground">
              Coming Event
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {comingEventsState.map((ev) => (
                <OrganizerEventCard key={ev.event_id} {...ev} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl leading-7 font-normal text-foreground">
              All Events
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allEventsState.map((ev) => (
                <OrganizerEventCard key={ev.event_id} {...ev} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </PageLayout>
  )
}
