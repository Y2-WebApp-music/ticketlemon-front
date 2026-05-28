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
import { TicketTypeCard } from "@/features/ticket-type"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import type { OutputData } from "@editorjs/editorjs"
import { ChevronUp, Pencil, Save, Ticket } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type {
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
  /** Called when description is saved (e.g. after Save button); omit to only allow in-place editing */
  onDescriptionSave?: (data: OutputData) => void
}

function DescriptionEditToolbar({
  onSave,
  onCancel,
}: {
  onSave: (data: OutputData) => void
  onCancel: () => void
}) {
  const { editor } = useEditorJs()
  const [saving, setSaving] = useState(false)
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const data = await saveEditor(editor)
      if (data) onSave(data)
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

export function OrganizerEventTabs({
  eventId,
  description,
  ticketGroups,
  sellingTableResponse,
  sellingTableLoading = false,
  onSellingQueryChange,
  onSellingTicketSelect,
  openingSellingTicket,
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

  const handleDescriptionSave = useCallback(
    (data: OutputData) => {
      setEditingDescription(data)
      setIsEditing(false)
      onDescriptionSave?.(data)
    },
    [onDescriptionSave]
  )

  const openSellingTicket = useCallback(
    (selection: OrganizerSellingTicketSelection) => {
      setActiveTab("ticket-type")
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
          {selectedSellingTicket &&
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
