import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Plus, Save, Ticket, Trash2 } from "lucide-react"
import type { DateRangeEntry, TicketTypeEntry } from "@/types/create-event"
import { formatDateRangeLabel } from "@/types/create-event"

export interface TicketTypeSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  ticketTypes: TicketTypeEntry[]
  eventDateEntries: DateRangeEntry[]
  saleDateEntries: DateRangeEntry[]
  onUpdate: (id: string, patch: Partial<TicketTypeEntry>) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onToggleCollapse: (id: string) => void
}

export function TicketTypeSection({
  sectionRef,
  ticketTypes,
  eventDateEntries,
  saleDateEntries,
  onUpdate,
  onAdd,
  onRemove,
  onToggleCollapse,
}: TicketTypeSectionProps) {
  return (
    <section ref={sectionRef} id="ticket-type">
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Ticket Type</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add ticket types with name, price, and quantity.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              {ticket.isCollapsed ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary"
                    aria-hidden
                  >
                    <Ticket className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-lg font-medium leading-7 text-foreground">
                      {ticket.name || "—"}
                    </p>
                    <p className="text-base leading-6 text-muted-foreground">
                      for event:{" "}
                      {ticket.useForEventDateTime
                        ? formatDateRangeLabel(
                            eventDateEntries.find(
                              (e) => e.id === ticket.useForEventDateTime
                            ) ?? undefined
                          )
                        : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.quantity
                        ? `${Number(ticket.quantity).toLocaleString()} Ticket`
                        : ""}
                      {ticket.quantity && ticket.price && " | "}
                      {ticket.price
                        ? `${ticket.price} THB per Ticket`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => onRemove(ticket.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onToggleCollapse(ticket.id)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>
                        Ticket Name{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="VVIP + Soundcheck"
                        value={ticket.name}
                        onChange={(e) =>
                          onUpdate(ticket.id, { name: e.target.value })
                        }
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Ticket Price{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="350 THB"
                        value={ticket.price}
                        onChange={(e) =>
                          onUpdate(ticket.id, { price: e.target.value })
                        }
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Quantity{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="23,000"
                        value={ticket.quantity}
                        onChange={(e) =>
                          onUpdate(ticket.id, { quantity: e.target.value })
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ticket Detail</Label>
                    <Textarea
                      placeholder="Type your message here."
                      value={ticket.detail}
                      onChange={(e) =>
                        onUpdate(ticket.id, { detail: e.target.value })
                      }
                      className="min-h-20 rounded-lg"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Ready to send Date and Time{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={ticket.useForEventDateTime}
                        onValueChange={(v) =>
                          onUpdate(ticket.id, { useForEventDateTime: v })
                        }
                      >
                        <SelectTrigger className="w-full rounded-lg">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventDateEntries.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {formatDateRangeLabel(e)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Sale Ticket On{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={ticket.saleTicketOn}
                        onValueChange={(v) =>
                          onUpdate(ticket.id, { saleTicketOn: v })
                        }
                      >
                        <SelectTrigger className="w-full rounded-lg">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {saleDateEntries.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {formatDateRangeLabel(e)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => onRemove(ticket.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        onUpdate(ticket.id, { isCollapsed: true })
                      }
                    >
                      <Save className="size-4" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="text-primary hover:bg-primary/10"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            Add Ticket Type
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
