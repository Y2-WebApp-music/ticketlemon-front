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
  type StaffEntry,
  type TicketTypeEntry,
} from "@/features/create-event"
import { Link } from "@tanstack/react-router"
import { ChevronLeft, Plus } from "lucide-react"
import {
  createEmptyDateRangeEntry,
  createEmptyStaffEntry,
  createEmptyTicketTypeEntry,
  createInitialCreateEventPayload,
  type CreateEventPayload,
} from "@/types/create-event"
import { useMemo, useRef, useState } from "react"

export default function CreateEventPage() {
  const [formData, setFormData] = useState<CreateEventPayload>(() =>
    createInitialCreateEventPayload()
  )

  const {
    eventName,
    category,
    location,
    impactGenre,
    ageRestriction,
    description,
    posterPreview,
    thumbnailPreview,
    eventDateEntries,
    saleDateEntries,
    ticketTypes,
    ticketMinPerOrder,
    ticketMaxPerOrder,
    staffEntries,
  } = formData

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        posterPreview: URL.createObjectURL(file),
      }))
    }
  }
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnailPreview: URL.createObjectURL(file),
      }))
    }
  }

  const updateEventDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      eventDateEntries: prev.eventDateEntries.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }
  const addEventDateEntry = () => {
    setFormData((prev) => ({
      ...prev,
      eventDateEntries: [
        ...prev.eventDateEntries,
        createEmptyDateRangeEntry(),
      ],
    }))
  }
  const removeEventDateEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      eventDateEntries: prev.eventDateEntries.filter((e) => e.id !== id),
    }))
  }
  const toggleEventDateCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      eventDateEntries: prev.eventDateEntries.map((e) =>
        e.id === id ? { ...e, isCollapsed: !e.isCollapsed } : e
      ),
    }))
  }

  const updateSaleDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      saleDateEntries: prev.saleDateEntries.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }
  const addSaleDateEntry = () => {
    setFormData((prev) => ({
      ...prev,
      saleDateEntries: [
        ...prev.saleDateEntries,
        createEmptyDateRangeEntry(),
      ],
    }))
  }
  const removeSaleDateEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      saleDateEntries: prev.saleDateEntries.filter((e) => e.id !== id),
    }))
  }
  const toggleSaleDateCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      saleDateEntries: prev.saleDateEntries.map((e) =>
        e.id === id ? { ...e, isCollapsed: !e.isCollapsed } : e
      ),
    }))
  }

  const updateTicketType = (id: string, patch: Partial<TicketTypeEntry>) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }))
  }
  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        createEmptyTicketTypeEntry(),
      ],
    }))
  }
  const removeTicketType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((t) => t.id !== id),
    }))
  }
  const toggleTicketCollapse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((t) =>
        t.id === id ? { ...t, isCollapsed: !t.isCollapsed } : t
      ),
    }))
  }

  const updateStaffEntry = (id: string, patch: Partial<StaffEntry>) => {
    setFormData((prev) => ({
      ...prev,
      staffEntries: prev.staffEntries.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }))
  }
  const addStaffEntry = () => {
    setFormData((prev) => ({
      ...prev,
      staffEntries: [
        ...prev.staffEntries,
        createEmptyStaffEntry(),
      ],
    }))
  }
  const removeStaffEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      staffEntries: prev.staffEntries.filter((s) => s.id !== id),
    }))
  }

  const completedSectionIds = useMemo(() => {
    const ids: string[] = []
    if (posterPreview || thumbnailPreview) ids.push("event-cover")
    if (
      eventName.trim() !== "" &&
      category &&
      location &&
      ageRestriction.trim() !== ""
    ) {
      ids.push("event-name", "event-category")
    }
    if (description?.blocks && description.blocks.length > 0)
      ids.push("event-description")
    if (eventDateEntries.some((e) => e.startDate)) ids.push("event-date-time")
    if (saleDateEntries.some((e) => e.startDate)) ids.push("sale-date-time")
    if (
      ticketTypes.some(
        (t) =>
          t.name.trim() !== "" &&
          t.price.trim() !== "" &&
          t.quantity.trim() !== ""
      )
    )
      ids.push("ticket-type")
    if (ticketMinPerOrder && ticketMaxPerOrder) ids.push("ticket-setting")
    if (
      staffEntries.some(
        (s) => s.reserveCode.trim() !== "" && s.email.trim() !== ""
      )
    )
      ids.push("staff")
    return ids
  }, [
    ageRestriction,
    category,
    description,
    eventName,
    eventDateEntries,
    location,
    posterPreview,
    saleDateEntries,
    staffEntries,
    thumbnailPreview,
    ticketMaxPerOrder,
    ticketMinPerOrder,
    ticketTypes,
  ])

  const handleCreateEvent = () => {
    console.log("create-event payload", formData)
  }

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto max-w-[1264px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-8">
            <div>
              <Link
                to="/organizer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-medium text-primary">
                Create Event
              </h1>
            </div>

            <EventCoverSection
              sectionRef={(el) => {
                sectionRefs.current["event-cover"] = el
              }}
              posterPreview={posterPreview}
              thumbnailPreview={thumbnailPreview}
              onPosterChange={handlePosterChange}
              onThumbnailChange={handleThumbnailChange}
            />

            <EventDetailSection
              sectionRef={(el) => {
                sectionRefs.current["event-name"] = el
                sectionRefs.current["event-category"] = el
              }}
              eventName={eventName}
              category={category}
              location={location}
              impactGenre={impactGenre}
              ageRestriction={ageRestriction}
              onEventNameChange={(value) =>
                setFormData((prev) => ({ ...prev, eventName: value }))
              }
              onCategoryChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              onLocationChange={(value) =>
                setFormData((prev) => ({ ...prev, location: value }))
              }
              onImpactGenreChange={(value) =>
                setFormData((prev) => ({ ...prev, impactGenre: value }))
              }
              onAgeRestrictionChange={(value) =>
                setFormData((prev) => ({ ...prev, ageRestriction: value }))
              }
            />

            <DateRangeSection
              sectionRef={(el) => {
                sectionRefs.current["event-date-time"] = el
              }}
              id="event-date-time"
              title="Event Date and Time"
              description="Set when your event starts and ends."
              addButtonLabel="Add Date and Time"
              entries={eventDateEntries}
              onUpdate={updateEventDateEntry}
              onAdd={addEventDateEntry}
              onRemove={removeEventDateEntry}
              onToggleCollapse={toggleEventDateCollapse}
            />

            <DescriptionSection
              sectionRef={(el) => {
                sectionRefs.current["event-description"] = el
              }}
              value={description}
              onChange={(data) =>
                setFormData((prev) => ({ ...prev, description: data }))
              }
            />

            <DateRangeSection
              sectionRef={(el) => {
                sectionRefs.current["sale-date-time"] = el
              }}
              id="sale-date-time"
              title="Sale Ticket Date and Time"
              description="Set when tickets go on sale and when sales end."
              addButtonLabel="Add Sale Date and Time"
              entries={saleDateEntries}
              onUpdate={updateSaleDateEntry}
              onAdd={addSaleDateEntry}
              onRemove={removeSaleDateEntry}
              onToggleCollapse={toggleSaleDateCollapse}
            />

            <TicketTypeSection
              sectionRef={(el) => {
                sectionRefs.current["ticket-type"] = el
              }}
              ticketTypes={ticketTypes}
              eventDateEntries={eventDateEntries}
              saleDateEntries={saleDateEntries}
              onUpdate={updateTicketType}
              onAdd={addTicketType}
              onRemove={removeTicketType}
              onToggleCollapse={toggleTicketCollapse}
            />

            <TicketSettingSection
              sectionRef={(el) => {
                sectionRefs.current["ticket-setting"] = el
              }}
              ticketMinPerOrder={ticketMinPerOrder}
              ticketMaxPerOrder={ticketMaxPerOrder}
              onTicketMinChange={(value) =>
                setFormData((prev) => ({ ...prev, ticketMinPerOrder: value }))
              }
              onTicketMaxChange={(value) =>
                setFormData((prev) => ({ ...prev, ticketMaxPerOrder: value }))
              }
            />

            <StaffSection
              sectionRef={(el) => {
                sectionRefs.current["staff"] = el
              }}
              staffEntries={staffEntries}
              onUpdate={updateStaffEntry}
              onAdd={addStaffEntry}
              onRemove={removeStaffEntry}
            />

            <div className="flex justify-end pb-8">
              <Button
                size="lg"
                className="rounded-lg"
                onClick={handleCreateEvent}
              >
                <Plus className="size-4" />
                Create Event
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
