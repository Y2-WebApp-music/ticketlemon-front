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
  createId,
  type DateRangeEntry,
  type StaffEntry,
  type TicketTypeEntry,
} from "@/features/create-event"
import type { OutputData } from "@editorjs/editorjs"
import { Link } from "@tanstack/react-router"
import { ChevronLeft, Plus } from "lucide-react"
import { useMemo, useRef, useState } from "react"

export default function CreateEventPage() {
  const [eventName, setEventName] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [impactGenre, setImpactGenre] = useState("")
  const [ageRestriction, setAgeRestriction] = useState("No")
  const [description, setDescription] = useState<OutputData | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [ticketMinPerOrder, setTicketMinPerOrder] = useState("")
  const [ticketMaxPerOrder, setTicketMaxPerOrder] = useState("")

  const [eventDateEntries, setEventDateEntries] = useState<DateRangeEntry[]>([
    {
      id: createId(),
      startDate: undefined,
      startHour: "",
      startMin: "",
      endDate: undefined,
      endHour: "",
      endMin: "",
      haveEndDate: true,
      isCollapsed: false,
    },
  ])
  const [saleDateEntries, setSaleDateEntries] = useState<DateRangeEntry[]>([
    {
      id: createId(),
      startDate: undefined,
      startHour: "",
      startMin: "",
      endDate: undefined,
      endHour: "",
      endMin: "",
      haveEndDate: true,
      isCollapsed: false,
    },
  ])
  const [ticketTypes, setTicketTypes] = useState<TicketTypeEntry[]>([
    {
      id: createId(),
      name: "",
      price: "",
      quantity: "",
      detail: "",
      useForEventDateTime: "",
      saleTicketOn: "",
      isCollapsed: false,
    },
  ])
  const [staffEntries, setStaffEntries] = useState<StaffEntry[]>([
    { id: createId(), reserveCode: "", email: "" },
  ])

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPosterPreview(URL.createObjectURL(file))
  }
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setThumbnailPreview(URL.createObjectURL(file))
  }

  const updateEventDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setEventDateEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    )
  }
  const addEventDateEntry = () => {
    setEventDateEntries((prev) => [
      ...prev,
      {
        id: createId(),
        startDate: undefined,
        startHour: "",
        startMin: "",
        endDate: undefined,
        endHour: "",
        endMin: "",
        haveEndDate: true,
        isCollapsed: false,
      },
    ])
  }
  const removeEventDateEntry = (id: string) => {
    setEventDateEntries((prev) => prev.filter((e) => e.id !== id))
  }
  const toggleEventDateCollapse = (id: string) => {
    setEventDateEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isCollapsed: !e.isCollapsed } : e))
    )
  }

  const updateSaleDateEntry = (id: string, patch: Partial<DateRangeEntry>) => {
    setSaleDateEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    )
  }
  const addSaleDateEntry = () => {
    setSaleDateEntries((prev) => [
      ...prev,
      {
        id: createId(),
        startDate: undefined,
        startHour: "",
        startMin: "",
        endDate: undefined,
        endHour: "",
        endMin: "",
        haveEndDate: true,
        isCollapsed: false,
      },
    ])
  }
  const removeSaleDateEntry = (id: string) => {
    setSaleDateEntries((prev) => prev.filter((e) => e.id !== id))
  }
  const toggleSaleDateCollapse = (id: string) => {
    setSaleDateEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isCollapsed: !e.isCollapsed } : e))
    )
  }

  const updateTicketType = (id: string, patch: Partial<TicketTypeEntry>) => {
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    )
  }
  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        id: createId(),
        name: "",
        price: "",
        quantity: "",
        detail: "",
        useForEventDateTime: "",
        saleTicketOn: "",
        isCollapsed: false,
      },
    ])
  }
  const removeTicketType = (id: string) => {
    setTicketTypes((prev) => prev.filter((t) => t.id !== id))
  }
  const toggleTicketCollapse = (id: string) => {
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCollapsed: !t.isCollapsed } : t))
    )
  }

  const updateStaffEntry = (id: string, patch: Partial<StaffEntry>) => {
    setStaffEntries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }
  const addStaffEntry = () => {
    setStaffEntries((prev) => [
      ...prev,
      { id: createId(), reserveCode: "", email: "" },
    ])
  }
  const removeStaffEntry = (id: string) => {
    setStaffEntries((prev) => prev.filter((s) => s.id !== id))
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
    if (
      eventDateEntries.some((e) => e.startDate && (e.startHour || e.startMin))
    )
      ids.push("event-date-time")
    if (saleDateEntries.some((e) => e.startDate && (e.startHour || e.startMin)))
      ids.push("sale-date-time")
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
    posterPreview,
    thumbnailPreview,
    eventName,
    category,
    location,
    ageRestriction,
    description,
    eventDateEntries,
    saleDateEntries,
    ticketTypes,
    ticketMinPerOrder,
    ticketMaxPerOrder,
    staffEntries,
  ])

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
              onEventNameChange={setEventName}
              onCategoryChange={setCategory}
              onLocationChange={setLocation}
              onImpactGenreChange={setImpactGenre}
              onAgeRestrictionChange={setAgeRestriction}
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
              onChange={(data) => setDescription(data)}
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
              onTicketMinChange={setTicketMinPerOrder}
              onTicketMaxChange={setTicketMaxPerOrder}
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
              <Button size="lg" className="rounded-lg">
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
