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
import { ORGANIZER_EVENT_STATUS_FILTER_OPTIONS } from "@/constants/event-status.constant"
import { ORGANIZER_EVENT_SORT_OPTIONS } from "@/constants/organizer-event-sort.constant"
import type { OrganizerEvent } from "@/types"
import { getAllEvents } from "@/services/eventService"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function OrganizerDashboardPage() {
  const [comingEventsState, setComingEventsState] = useState<OrganizerEvent[]>(
    []
  )
  const [allEventsState, setAllEventsState] = useState<OrganizerEvent[]>([])
  const [organizerNameState, setOrganizerNameState] = useState("Organizer")

  useEffect(() => {
    const load = async () => {
      try {
        const events = await getAllEvents()
        const mapped: OrganizerEvent[] = events.map((event) => {
          const firstShowDate = event.event_date_entries[0]?.start_date ?? ""
          const showBeginLabel = firstShowDate
            ? `Show begin ${new Date(firstShowDate).toLocaleString()}`
            : "No schedule"

          return {
            event_id: event.id,
            image_url: event.poster_url ?? "",
            date: firstShowDate,
            title: event.event_name,
            venue: event.venue,
            status_id: 0,
            status_label: "Scheduled",
            bottom_line: showBeginLabel,
          }
        })

        const now = Date.now()
        const coming = mapped.filter((event) => {
          if (!event.date) return false
          return new Date(event.date).getTime() >= now
        })

        setComingEventsState(coming)
        setAllEventsState(mapped)
        const firstCreator = events.find((event) => event.create_by)?.create_by
        if (firstCreator) setOrganizerNameState(firstCreator)
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load organizer events"
        toast.error(message)
      }
    }

    load()
  }, [])

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

          {/* Filters */}
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
              />
            </div>
            <div className="w-[190px] space-y-1.5">
              <Label className="text-sm">
                Event Status <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger
                  id="organizer-status"
                  className="w-full rounded-lg"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZER_EVENT_STATUS_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
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
              <Select>
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

          {/* Coming Event */}
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

          {/* All Events */}
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
