import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  EditorJs,
  defaultEditorTools,
  saveEditor,
  useEditorJs,
} from "@/components/editor-js"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  OrganizerEventSellingTable,
  type OrganizerSellingTicketSelection,
} from "./organizer-event-selling-table"
import { OrganizerEventCheckInTable } from "./organizer-event-check-in-table"
import { TicketTypeCard } from "@/features/ticket-type"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import type { OutputData } from "@editorjs/editorjs"
import { ChevronUp, Pencil, Save, Ticket } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type {
  CheckInTableResponse,
  EventCheckInQueryParams,
  EventSellingQueryParams,
  SellingTableResponse,
} from "@/types/organizer"

export interface OrganizerTicketTypeGroup {
  sessionLabel: string
  tickets: TicketTypeCardProps[]
}

export interface OrganizerEventTabsProps {
  eventId: string
  description: OutputData
  /** Ticket types grouped by event_date (collapsible per group); variants: notOnSale, available, saleEnd */
  ticketGroups: OrganizerTicketTypeGroup[]
  sellingTableResponse: SellingTableResponse | null
  sellingTableLoading?: boolean
  onSellingQueryChange?: (params: EventSellingQueryParams) => void
  onSellingTicketSelect?: (selection: OrganizerSellingTicketSelection) => void
  /** Open selling table from external trigger (e.g. hero See Selling button). */
  openingSellingTicket?: OrganizerSellingTicketSelection | null
  checkInTableResponse: CheckInTableResponse | null
  checkInTableLoading?: boolean
  onCheckInQueryChange?: (params: EventCheckInQueryParams) => void
  /** Open check-in table from external trigger (e.g. hero Check In button). */
  openingCheckInList?: number
  /** Called when description is saved (e.g. after Save button); omit to only allow in-place editing */
  onDescriptionSave?: (data: OutputData) => void | Promise<void>
}

function DescriptionEditToolbar({
  onSave,
  onCancel,
}: {
  onSave: (data: OutputData) => void | Promise<void>
  onCancel: () => void
}) {
  const { editor } = useEditorJs()
  const [saving, setSaving] = useState(false)
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const data = await saveEditor(editor)
      if (data) await onSave(data)
    } finally {
      setSaving(false)
    }
  }, [editor, onSave])
  return (
    <div className="mb-4 flex justify-end gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={saving}
        onClick={handleSave}
      >
        <Save className="size-4" aria-hidden />
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  )
}

const EMPTY_CHECK_IN_RESPONSE: CheckInTableResponse = {
  data: [],
  total: 0,
  page: 1,
  perPage: 15,
  event_date_entries: [],
  ticket_types: [],
}

export function OrganizerEventTabs({
  eventId,
  description,
  ticketGroups,
  sellingTableResponse,
  sellingTableLoading = false,
  onSellingQueryChange,
  onSellingTicketSelect,
  openingSellingTicket,
  checkInTableResponse,
  checkInTableLoading = false,
  onCheckInQueryChange,
  openingCheckInList = 0,
  onDescriptionSave,
}: OrganizerEventTabsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingDescription, setEditingDescription] =
    useState<OutputData>(description)
  const [activeTab, setActiveTab] = useState<"description" | "ticket-type">(
    "description"
  )
  const [selectedSellingTicket, setSelectedSellingTicket] =
    useState<OrganizerSellingTicketSelection | null>(null)
  const [showCheckInList, setShowCheckInList] = useState(false)

  const handleDescriptionSave = useCallback(
    async (data: OutputData) => {
      try {
        await onDescriptionSave?.(data)
        setEditingDescription(data)
        setIsEditing(false)
      } catch {
        // Parent shows error toast; keep edit mode open
      }
    },
    [onDescriptionSave]
  )

  const openSellingTicket = useCallback(
    (selection: OrganizerSellingTicketSelection) => {
      setActiveTab("ticket-type")
      setShowCheckInList(false)
      setSelectedSellingTicket(selection)
      onSellingTicketSelect?.(selection)
    },
    [onSellingTicketSelect]
  )

  useEffect(() => {
    if (!openingSellingTicket) return
    const timerId = window.setTimeout(() => {
      openSellingTicket(openingSellingTicket)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [openingSellingTicket, openSellingTicket])

  useEffect(() => {
    if (!openingCheckInList) return
    const timerId = window.setTimeout(() => {
      setActiveTab("ticket-type")
      setSelectedSellingTicket(null)
      setShowCheckInList(true)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [openingCheckInList])

  return (
    <div className="mx-auto mt-6 w-full max-w-[1280px] px-4 pb-16 sm:px-6">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "description" | "ticket-type")}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ticket-type">Ticket Type</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="p-4 sm:p-6">
            {!isEditing ? (
              <>
                <div className="mb-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary text-primary hover:bg-primary/10"
                    onClick={() => {
                      setEditingDescription(description)
                      setIsEditing(true)
                    }}
                  >
                    <Pencil className="size-4" aria-hidden />
                    Edit Description
                  </Button>
                </div>
                <EditorJs
                  key={`organizer-desc-${eventId}-read`}
                  readOnly
                  initialData={editingDescription}
                  tools={defaultEditorTools}
                  minHeight={200}
                  className="min-h-[200px]"
                />
              </>
            ) : (
              <EditorJs
                key={`organizer-desc-${eventId}-edit`}
                readOnly={false}
                initialData={editingDescription}
                tools={defaultEditorTools}
                minHeight={200}
                className="min-h-[200px]"
              >
                <DescriptionEditToolbar
                  onSave={handleDescriptionSave}
                  onCancel={() => setIsEditing(false)}
                />
              </EditorJs>
            )}
          </div>
        </TabsContent>
        <TabsContent value="ticket-type" className="mt-0 space-y-3">
          {showCheckInList && onCheckInQueryChange ? (
            <OrganizerEventCheckInTable
              checkInTableResponse={
                checkInTableResponse ?? EMPTY_CHECK_IN_RESPONSE
              }
              isLoading={checkInTableLoading || !checkInTableResponse}
              onQueryChange={onCheckInQueryChange}
              onBack={() => setShowCheckInList(false)}
            />
          ) : selectedSellingTicket &&
            sellingTableResponse &&
            onSellingQueryChange ? (
            <OrganizerEventSellingTable
              selectedTicket={selectedSellingTicket}
              sellingTableResponse={sellingTableResponse}
              isLoading={sellingTableLoading}
              onQueryChange={onSellingQueryChange}
              onBack={() => setSelectedSellingTicket(null)}
            />
          ) : (
            ticketGroups.map((group, groupIndex) => (
              <Collapsible key={groupIndex} defaultOpen className="space-y-3">
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl bg-primary px-5 py-4 text-left text-white transition-opacity hover:opacity-95">
                  <div className="flex items-center gap-2">
                    <Ticket className="size-6 shrink-0" aria-hidden />
                    <span className="text-lg font-medium">
                      {group.sessionLabel}
                    </span>
                  </div>
                  <ChevronUp className="size-6 shrink-0" aria-hidden />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3">
                  {group.tickets.map((ticket, i) => {
                    const isOpenable = ticket.variant !== "notOnSale"
                    return (
                      <div
                        key={i}
                        role={isOpenable ? "button" : undefined}
                        tabIndex={isOpenable ? 0 : undefined}
                        className={isOpenable ? "cursor-pointer" : undefined}
                        onClick={
                          isOpenable
                            ? () =>
                                openSellingTicket({
                                  sessionLabel: group.sessionLabel,
                                  title: ticket.title,
                                })
                            : undefined
                        }
                        onKeyDown={
                          isOpenable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  openSellingTicket({
                                    sessionLabel: group.sessionLabel,
                                    title: ticket.title,
                                  })
                                }
                              }
                            : undefined
                        }
                      >
                        <TicketTypeCard {...ticket} />
                      </div>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
