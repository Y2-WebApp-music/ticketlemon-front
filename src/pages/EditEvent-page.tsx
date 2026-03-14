import { PageLayout } from "@/components/layouts/page-layout"
import { Button } from "@/components/ui/button"
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
import { Link, useParams } from "@tanstack/react-router"
import { ChevronLeft, Save } from "lucide-react"
import {
  createEmptyDateRangeEntry,
  createEmptyStaffEntry,
  createEmptyTicketTypeEntry,
  createInitialCreateEventPayload,
  type CreateEventPayload,
} from "@/types/create-event"
import { useMemo, useRef, useState } from "react"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import { toast } from "sonner"

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

export default function EditEventPage() {
  const { eventId } = useParams({ from: "/organizer/edit/$eventId" })

  const [formData, setFormData] = useState<CreateEventPayload>(() =>
    createInitialCreateEventPayload()
  )

  const {
    event_name,
    category,
    venue,
    impact_genre,
    age_restriction,
    description,
    poster_preview,
    thumbnail_preview,
    event_date_entries,
    sale_date_entries,
    ticket_types,
    ticket_min_per_order,
    ticket_max_per_order,
    staff_entries,
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

    setFormData((prev) => ({
      ...prev,
      poster_preview: URL.createObjectURL(file),
    }))
  }
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateImageSize(file, "Thumbnail")) {
      e.target.value = ""
      return
    }

    setFormData((prev) => ({
      ...prev,
      thumbnail_preview: URL.createObjectURL(file),
    }))
  }
  const handlePosterRemove = () => {
    setFormData((prev) => ({ ...prev, poster_preview: null }))
  }
  const handleThumbnailRemove = () => {
    setFormData((prev) => ({ ...prev, thumbnail_preview: null }))
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
      staff_entries: {
        id: prev.staff_entries.id ?? createEmptyStaffEntry().id,
        reserve_code: value,
      },
    }))
  }

  const completedSectionIds = useMemo(() => {
    const ids: string[] = []
    if (poster_preview || thumbnail_preview)
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
    if ((staff_entries.reserve_code ?? "").trim() !== "")
      ids.push(CREATE_EVENT_SIDEBAR_SECTIONS[7].id)
    return ids
  }, [
    age_restriction,
    category,
    description,
    event_name,
    event_date_entries,
    venue,
    poster_preview,
    sale_date_entries,
    staff_entries,
    thumbnail_preview,
    ticket_max_per_order,
    ticket_min_per_order,
    ticket_types,
  ])

  const handleUpdateEvent = () => {
    console.log("edit-event payload", formData)
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

            <EventCoverSection
              sectionRef={(el) => {
                sectionRefs.current[CREATE_EVENT_SIDEBAR_SECTIONS[0].id] = el
              }}
              posterPreview={poster_preview}
              thumbnailPreview={thumbnail_preview}
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
              staffCode={staff_entries.reserve_code ?? ""}
              onStaffCodeChange={updateStaffCode}
            />

            <div className="flex justify-end pb-8">
              <Button
                size="lg"
                className="rounded-lg"
                onClick={handleUpdateEvent}
                disabled={!isEditEventReady}
              >
                <Save className="size-4" />
                Save Changes
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
