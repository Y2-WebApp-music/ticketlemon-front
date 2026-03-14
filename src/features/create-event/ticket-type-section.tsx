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
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import { Pencil, Plus, Save, Ticket, Trash2 } from "lucide-react"
import type { DateRangeEntry, TicketTypeEntry } from "@/types/create-event"
import { formatDateRangeLabel } from "@/types/create-event"
import { useState } from "react"

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
  type RequiredField =
    | "name"
    | "price"
    | "quantity"
    | "use_for_event_date_time"
    | "sale_ticket_on"

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, Partial<Record<RequiredField, string>>>
  >({})

  const formatNumericInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    if (!digitsOnly) return ""
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const setFieldError = (
    ticketId: string,
    field: RequiredField,
    message?: string
  ) => {
    setFieldErrors((prev) => {
      const current = prev[ticketId] ?? {}
      const nextForTicket = { ...current }

      if (message) nextForTicket[field] = message
      else delete nextForTicket[field]

      if (Object.keys(nextForTicket).length === 0) {
        const nextErrors = { ...prev }
        delete nextErrors[ticketId]
        return nextErrors
      }

      return { ...prev, [ticketId]: nextForTicket }
    })
  }

  const validateBeforeSave = (ticket: TicketTypeEntry) => {
    const errors: Partial<Record<RequiredField, string>> = {}

    if (!ticket.name.trim()) errors.name = "Ticket name is required."
    if (!ticket.price.trim()) errors.price = "Ticket price is required."
    if (!ticket.quantity.trim()) errors.quantity = "Quantity is required."
    if (!ticket.use_for_event_date_time.trim()) {
      errors.use_for_event_date_time = "Event date and time is required."
    }
    if (!ticket.sale_ticket_on.trim()) {
      errors.sale_ticket_on = "Sale ticket date and time is required."
    }

    setFieldErrors((prev) => {
      if (Object.keys(errors).length === 0) {
        const nextErrors = { ...prev }
        delete nextErrors[ticket.id]
        return nextErrors
      }
      return { ...prev, [ticket.id]: errors }
    })

    return Object.keys(errors).length === 0
  }

  const handleSave = (ticket: TicketTypeEntry) => {
    if (!validateBeforeSave(ticket)) return
    onUpdate(ticket.id, { is_collapsed: true })
  }

  return (
    <section
      ref={sectionRef}
      id={CREATE_EVENT_SIDEBAR_SECTIONS[5].id}
      className="space-y-4"
    >
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
              className="overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              {ticket.is_collapsed ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary"
                    aria-hidden
                  >
                    <Ticket className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-lg text-foreground">
                      {ticket.name || "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Show:{" "}
                      {ticket.use_for_event_date_time
                        ? formatDateRangeLabel(
                            eventDateEntries.find(
                              (e) => e.id === ticket.use_for_event_date_time
                            ) ?? undefined
                          )
                        : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.quantity ? `${ticket.quantity} Ticket` : ""}
                      {ticket.quantity && ticket.price && " | "}
                      {ticket.price ? `${ticket.price} THB per Ticket` : ""}
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
                        Ticket Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="VVIP + Soundcheck"
                        value={ticket.name}
                        onChange={(e) => {
                          const value = e.target.value
                          onUpdate(ticket.id, { name: value })
                          if (value.trim()) setFieldError(ticket.id, "name")
                        }}
                        aria-invalid={
                          fieldErrors[ticket.id]?.name ? true : undefined
                        }
                        className="rounded-lg"
                      />
                      {fieldErrors[ticket.id]?.name && (
                        <p className="text-sm text-destructive">
                          {fieldErrors[ticket.id]?.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Ticket Price <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="350"
                          value={ticket.price}
                          onChange={(e) => {
                            const value = formatNumericInput(e.target.value)
                            onUpdate(ticket.id, { price: value })
                            if (value.trim()) setFieldError(ticket.id, "price")
                          }}
                          aria-invalid={
                            fieldErrors[ticket.id]?.price ? true : undefined
                          }
                          inputMode="numeric"
                          pattern="\d*"
                          className="rounded-lg pr-12"
                        />
                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                          THB
                        </span>
                      </div>
                      {fieldErrors[ticket.id]?.price && (
                        <p className="text-sm text-destructive">
                          {fieldErrors[ticket.id]?.price}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="23,000"
                        value={ticket.quantity}
                        onChange={(e) => {
                          const value = formatNumericInput(e.target.value)
                          onUpdate(ticket.id, { quantity: value })
                          if (value.trim()) setFieldError(ticket.id, "quantity")
                        }}
                        aria-invalid={
                          fieldErrors[ticket.id]?.quantity ? true : undefined
                        }
                        inputMode="numeric"
                        pattern="\d*"
                        className="rounded-lg"
                      />
                      {fieldErrors[ticket.id]?.quantity && (
                        <p className="text-sm text-destructive">
                          {fieldErrors[ticket.id]?.quantity}
                        </p>
                      )}
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
                        value={ticket.use_for_event_date_time}
                        onValueChange={(v) => {
                          onUpdate(ticket.id, { use_for_event_date_time: v })
                          if (v.trim()) {
                            setFieldError(ticket.id, "use_for_event_date_time")
                          }
                        }}
                      >
                        <SelectTrigger
                          className="w-full rounded-lg"
                          aria-invalid={
                            fieldErrors[ticket.id]?.use_for_event_date_time
                              ? true
                              : undefined
                          }
                        >
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
                      {fieldErrors[ticket.id]?.use_for_event_date_time && (
                        <p className="text-sm text-destructive">
                          {fieldErrors[ticket.id]?.use_for_event_date_time}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Sale Ticket On{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={ticket.sale_ticket_on}
                        onValueChange={(v) => {
                          onUpdate(ticket.id, { sale_ticket_on: v })
                          if (v.trim())
                            setFieldError(ticket.id, "sale_ticket_on")
                        }}
                      >
                        <SelectTrigger
                          className="w-full rounded-lg"
                          aria-invalid={
                            fieldErrors[ticket.id]?.sale_ticket_on
                              ? true
                              : undefined
                          }
                        >
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
                      {fieldErrors[ticket.id]?.sale_ticket_on && (
                        <p className="text-sm text-destructive">
                          {fieldErrors[ticket.id]?.sale_ticket_on}
                        </p>
                      )}
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
                    <Button type="button" onClick={() => handleSave(ticket)}>
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
