import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { EditorJs, defaultEditorTools } from "@/components/editor-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketTypeCard } from "@/features/ticket-type"
import type { TicketTypeCardProps } from "@/features/ticket-type"
import type { OutputData } from "@editorjs/editorjs"
import { Link } from "@tanstack/react-router"
import { ChevronUp, Ticket } from "lucide-react"

export interface TicketTypeGroup {
  sessionLabel: string
  tickets: TicketTypeCardProps[]
}

export interface EventTabsProps {
  eventId: string
  description: OutputData
  /** Ticket types grouped by event_date (collapsible per group) */
  ticketGroups: TicketTypeGroup[]
}

export function EventTabs({
  eventId,
  description,
  ticketGroups,
}: EventTabsProps) {
  return (
    <div className="mx-auto mt-6 w-full max-w-[1280px] px-4 pb-16 sm:px-6">
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ticket-type">Ticket Type</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="p-4 sm:p-6">
            <EditorJs
              key={`event-desc-${eventId}`}
              readOnly
              initialData={description}
              tools={defaultEditorTools}
              minHeight={200}
              className="min-h-[200px]"
            />
          </div>
        </TabsContent>
        <TabsContent value="ticket-type" className="mt-0 space-y-3">
          {ticketGroups.map((group, groupIndex) => (
            <Collapsible key={groupIndex} defaultOpen className="space-y-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl bg-primary px-5 py-4 text-left text-white transition-opacity hover:opacity-95">
                <div className="flex items-center gap-2">
                  <Ticket className="size-6 shrink-0" aria-hidden />
                  <span className="text-lg font-medium">{group.sessionLabel}</span>
                </div>
                <ChevronUp className="size-6 shrink-0" aria-hidden />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                {group.tickets.map((ticket, i) =>
                  ticket.variant === "available" ? (
                    <Link
                      key={i}
                      to="/events/$eventId/choose"
                      params={{ eventId }}
                      className="block cursor-pointer [&>div]:transition-colors [&>div]:hover:bg-muted/50"
                    >
                      <TicketTypeCard {...ticket} />
                    </Link>
                  ) : (
                    <TicketTypeCard key={i} {...ticket} />
                  )
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
