import { PageLayout } from "@/components/layouts/page-layout"
import { Button } from "@/components/ui/button"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import {
  CreateEventSidebar,
  DateRangeSection,
  DescriptionSection,
  EventCoverSection,
  EventDetailSection,
  StaffSection,
  TicketSettingSection,
  TicketTypeSection,
  type DateRangeEntry,
  type TicketTypeEntry,
} from "@/features/create-event"
import {
  createEmptyDateRangeEntry,
  createEmptyTicketTypeEntry,
  createInitialCreateEventPayload,
  type CreateEventPayload,
} from "@/types/create-event"
import {
  getEventById,
  updateEvent,
  type EventRequestPayload,
} from "@/services/eventService"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { ChevronLeft, Save } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import type { OutputData } from "@editorjs/editorjs"

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

export default function EditEventPage() {
  const { eventId } = useParams({ from: "/organizer/edit/$eventId" })
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CreateEventPayload>(() =>
    createInitialCreateEventPayload()
  )
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    event_name,
    category,
    venue,
    impact_genre,
    age_restriction,
    description,
    poster_url,
    thumbnail_url,
    event_date_entries,
    sale_date_entries,
    ticket_types,
    ticket_min_per_order,
    ticket_max_per_order,
    staff_code,
  } = formData

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: string) => {
    const target = sectionRefs.current[id]
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: "smooth" })
  }

  const validateImageSize = (file: File, label: "Poster" | "Thumbnail") => {
    if (file.size <= MAX_IMAGE_SIZE_BYTES) return true
    toast.error(`${label} image must be 10 MB or smaller.`)
    return false
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateImageSize(file, "Poster")) {
      e.target.value = ""
      return
    }

    setPosterFile(file)
    setFormData((prev) => {
      if (prev.poster_url?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.poster_url)
      }
      return {
        ...prev,
        poster_url: URL.createObjectURL(file),
      }
    })
  }
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateImageSize(file, "Thumbnail")) {
      e.target.value = ""
      return
    }

    setThumbnailFile(file)
    setFormData((prev) => {
      if (prev.thumbnail_url?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.thumbnail_url)
      }
      return {
        ...prev,
        thumbnail_url: URL.createObjectURL(file),
      }
    })
  }
  const handlePosterRemove = () => {
    setPosterFile(null)
    setFormData((prev) => {
      if (prev.poster_url?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.poster_url)
      }
      return { ...prev, poster_url: null }
    })
  }
  const handleThumbnailRemove = () => {
    setThumbnailFile(null)
    setFormData((prev) => {
      if (prev.thumbnail_url?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.thumbnail_url)
      }
      return { ...prev, thumbnail_url: null }
    })
  }

  const updateEventDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      event_date_entries: prev.event_date_entries.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }
  const addEventDateEntry = () => {
    setFormData((prev) => ({
      ...prev,
      event_date_entries: [
        ...prev.event_date_entries,
        createEmptyDateRangeEntry(),
      ],
    }))
  }
  const removeEventDateEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      event_date_entries: prev.event_date_entries.filter((e) => e.id !== id),
    }))
  }
  const toggleEventDateCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      event_date_entries: prev.event_date_entries.map((e) =>
        e.id === id ? { ...e, is_collapsed: !e.is_collapsed } : e
      ),
    }))
  }

  const updateSaleDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      sale_date_entries: prev.sale_date_entries.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }
  const addSaleDateEntry = () => {
    setFormData((prev) => ({
      ...prev,
      sale_date_entries: [
        ...prev.sale_date_entries,
        createEmptyDateRangeEntry(),
      ],
    }))
  }
  const removeSaleDateEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sale_date_entries: prev.sale_date_entries.filter((e) => e.id !== id),
    }))
  }
  const toggleSaleDateCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sale_date_entries: prev.sale_date_entries.map((e) =>
        e.id === id ? { ...e, is_collapsed: !e.is_collapsed } : e
      ),
    }))
  }

  const updateTicketType = (id: string, patch: Partial<TicketTypeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      ticket_types: prev.ticket_types.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }))
  }
  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticket_types: [...prev.ticket_types, createEmptyTicketTypeEntry()],
    }))
  }
  const removeTicketType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((t) => t.id !== id),
    }))
  }
  const toggleTicketCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ticket_types: prev.ticket_types.map((t) =>
        t.id === id ? { ...t, is_collapsed: !t.is_collapsed } : t
      ),
    }))
  }

  const updateStaffCode = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      staff_code: value,
    }))
  }

  useEffect(() => {
    const toOutputData = (raw: unknown): OutputData | null => {
      if (!raw) return null

      if (typeof raw === "object" && raw !== null && "blocks" in raw) {
        const maybe = raw as Partial<OutputData>
        if (Array.isArray(maybe.blocks)) return raw as OutputData
      }

      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw) as OutputData
          if (parsed && Array.isArray(parsed.blocks)) return parsed
        } catch {
          // fallback to plain text paragraph below
        }

        return {
          time: Date.now(),
          version: "2.31.0",
          blocks: [{ type: "paragraph", data: { text: raw } }],
        }
      }

      return null
    }

    const load = async () => {
      try {
        setIsLoading(true)
        const event = await getEventById(eventId)

        setPosterFile(null)
        setThumbnailFile(null)
        setFormData({
          event_name: event.event_name,
          category: event.category,
          venue: event.venue,
          impact_genre: event.impact_genre,
          age_restriction: String(event.age_restriction ?? ""),
          description: toOutputData(event.description),
          poster_url: event.poster_url ?? null,
          thumbnail_url: event.thumbnail_url ?? null,
          event_date_entries: event.event_date_entries?.map((entry) => ({
            id: entry.id,
            start_date: entry.start_date
              ? new Date(entry.start_date)
              : undefined,
            end_date: entry.end_date ? new Date(entry.end_date) : undefined,
            have_end_date: Boolean(entry.end_date),
            is_collapsed: false,
          })) ?? [createEmptyDateRangeEntry()],
          sale_date_entries: event.sale_date_entries?.map((entry) => ({
            id: entry.id,
            start_date: entry.start_date
              ? new Date(entry.start_date)
              : undefined,
            end_date: entry.end_date ? new Date(entry.end_date) : undefined,
            have_end_date: Boolean(entry.end_date),
            is_collapsed: false,
          })) ?? [createEmptyDateRangeEntry()],
          ticket_types: event.ticket_types?.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            price: String(ticket.price ?? ""),
            quantity: String(ticket.quantity ?? ""),
            detail: ticket.detail ?? "",
            use_for_event_date_time: ticket.use_for_event_date_time,
            sale_ticket_on: ticket.sale_ticket_on,
            is_collapsed: ticket.is_collapsed,
          })) ?? [createEmptyTicketTypeEntry()],
          ticket_min_per_order: String(event.ticket_min_per_order ?? ""),
          ticket_max_per_order: String(event.ticket_max_per_order ?? ""),
          staff_code: event.staff_code ?? "",
          create_by_id: event.create_by_id ?? "",
          create_by: event.create_by ?? "",
        })
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load event"
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [eventId])

  const completedSectionIds = useMemo(() => {
    const ids: string[] = []
    if (poster_url || thumbnail_url)
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[0].id)
    if (
      event_name.trim() !== "" &&
      category &&
      venue &&
      age_restriction.trim() !== ""
    ) {
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[1].id)
    }
    if (description?.blocks && description.blocks.length > 0)
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[3].id)
    if (event_date_entries.some((e) => e.start_date))
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[2].id)
    if (sale_date_entries.some((e) => e.start_date))
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[4].id)
    if (
      ticket_types.some(
        (t) =>
          t.name.trim() !== "" &&
          t.price.trim() !== "" &&
          t.quantity.trim() !== ""
      )
    )
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[5].id)
    if (ticket_min_per_order && ticket_max_per_order)
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[6].id)
    if ((staff_code ?? "").trim() !== "")
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[7].id)
    return ids
  }, [
    age_restriction,
    category,
    description,
    event_name,
    event_date_entries,
    venue,
    poster_url,
    sale_date_entries,
    staff_code,
    thumbnail_url,
    ticket_max_per_order,
    ticket_min_per_order,
    ticket_types,
  ])

  const handleUpdateEvent = async () => {
    try {
      setIsSubmitting(true)
      const payload: Partial<EventRequestPayload> = {
        ...formData,
        age_restriction: Number(formData.age_restriction),
        description: formData.description
          ? JSON.stringify(formData.description)
          : null,
        poster_url: posterFile
          ? posterFile
          : formData.poster_url === null
            ? ""
            : undefined,
        thumbnail_url: thumbnailFile
          ? thumbnailFile
          : formData.thumbnail_url === null
            ? ""
            : undefined,
        event_date_entries: formData.event_date_entries.map((entry) => ({
          id: entry.id,
          start_date: entry.start_date ? entry.start_date.toISOString() : "",
          end_date:
            entry.have_end_date && entry.end_date
              ? entry.end_date.toISOString()
              : null,
        })),
        sale_date_entries: formData.sale_date_entries.map((entry) => ({
          id: entry.id,
          start_date: entry.start_date ? entry.start_date.toISOString() : "",
          end_date:
            entry.have_end_date && entry.end_date
              ? entry.end_date.toISOString()
              : null,
        })),
        ticket_types: formData.ticket_types.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          quantity: ticket.quantity,
          detail: ticket.detail || null,
          use_for_event_date_time: ticket.use_for_event_date_time,
          sale_ticket_on: ticket.sale_ticket_on,
          is_collapsed: ticket.is_collapsed,
        })),
        create_by_id: formData.create_by_id ?? "",
        create_by: formData.create_by ?? "",
      }

      await updateEvent(eventId, payload)
      toast.success("Event updated successfully")
      navigate({
        to: "/organizer/events/$eventId",
        params: { eventId },
      })
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to update event"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditEventReady = CREATE_EVENT_SIDEBAR_SECTIONS.every((section) =>
    completedSectionIds.includes(section.id)
  )

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto max-w-[1264px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-8">
            <div>
              <Link
                to="/organizer/events/$eventId"
                params={{ eventId }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to event detail
              </Link>
              <h1 className="mt-2 text-2xl font-medium text-primary">
                Edit Event
              </h1>
            </div>
            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading event...</p>
            )}

            <EventCoverSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[0].id] = el
              }}
              posterPreview={poster_url}
              thumbnailPreview={thumbnail_url}
              onPosterChange={handlePosterChange}
              onThumbnailChange={handleThumbnailChange}
              onPosterRemove={handlePosterRemove}
              onThumbnailRemove={handleThumbnailRemove}
            />

            <EventDetailSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[1].id] = el
              }}
              eventName={event_name}
              category={category}
              venue={venue}
              impactGenre={impact_genre}
              ageRestriction={age_restriction}
              onEventNameChange={(value) =>
                setFormData((prev) => ({ ...prev, event_name: value }))
              }
              onCategoryChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              onLocationChange={(value) =>
                setFormData((prev) => ({ ...prev, venue: value }))
              }
              onImpactGenreChange={(value) =>
                setFormData((prev) => ({ ...prev, impact_genre: value }))
              }
              onAgeRestrictionChange={(value) =>
                setFormData((prev) => ({ ...prev, age_restriction: value }))
              }
            />

            <DateRangeSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[2].id] = el
              }}
              id={CREATE_EVENT_SIDEBAR_SECTIONS[2].id}
              title="Event Date and Time"
              description="Set when your event starts and ends."
              addButtonLabel="Add Date and Time"
              entries={event_date_entries}
              onUpdate={updateEventDateEntry}
              onAdd={addEventDateEntry}
              onRemove={removeEventDateEntry}
              onToggleCollapse={toggleEventDateCollapse}
            />

            <DescriptionSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[3].id] = el
              }}
              value={description}
              onChange={(data) =>
                setFormData((prev) => ({ ...prev, description: data }))
              }
            />

            <DateRangeSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[4].id] = el
              }}
              id={CREATE_EVENT_SIDEBAR_SECTIONS[4].id}
              title="Sale Ticket Date and Time"
              description="Set when tickets go on sale and when sales end."
              addButtonLabel="Add Sale Date and Time"
              entries={sale_date_entries}
              onUpdate={updateSaleDateEntry}
              onAdd={addSaleDateEntry}
              onRemove={removeSaleDateEntry}
              onToggleCollapse={toggleSaleDateCollapse}
            />

            <TicketTypeSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[5].id] = el
              }}
              ticketTypes={ticket_types}
              eventDateEntries={event_date_entries}
              saleDateEntries={sale_date_entries}
              onUpdate={updateTicketType}
              onAdd={addTicketType}
              onRemove={removeTicketType}
              onToggleCollapse={toggleTicketCollapse}
            />

            <TicketSettingSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[6].id] = el
              }}
              ticketMinPerOrder={ticket_min_per_order}
              ticketMaxPerOrder={ticket_max_per_order}
              onTicketMinChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  ticket_min_per_order: value,
                }))
              }
              onTicketMaxChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  ticket_max_per_order: value,
                }))
              }
            />

            <StaffSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[7].id] = el
              }}
              staffCode={staff_code ?? ""}
              onStaffCodeChange={updateStaffCode}
            />

            <div className="flex justify-end pb-8">
              <Button
                size="lg"
                className="rounded-lg"
                onClick={handleUpdateEvent}
                disabled={!isEditEventReady || isSubmitting || isLoading}
              >
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <CreateEventSidebar
            onScrollToSection={scrollToSection}
            completedSectionIds={completedSectionIds}
          />
        </div>
      </main>
    </PageLayout>
  )
}
