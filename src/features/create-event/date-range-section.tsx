import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarRange, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { DateRangeEntry } from "@/types/create-event"

export interface DateRangeSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  id: string
  title: string
  description: string
  addButtonLabel: string
  entries: DateRangeEntry[]
  onUpdate: (id: string, patch: Partial<DateRangeEntry>) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onToggleCollapse: (id: string) => void
}

export function DateRangeSection({
  sectionRef,
  id,
  title,
  description,
  addButtonLabel,
  entries,
  onUpdate,
  onAdd,
  onRemove,
  onToggleCollapse,
}: DateRangeSectionProps) {
  return (
    <section ref={sectionRef} id={id}>
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="overflow-hidden rounded-xl border border-border bg-card p-5"
            >
              {entry.isCollapsed ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary"
                    aria-hidden
                  >
                    <CalendarRange className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-lg leading-7 font-medium text-foreground">
                      {entry.startDate
                        ? format(entry.startDate, "d MMM yyyy")
                        : "—"}
                    </p>
                    <p className="text-base leading-6 text-muted-foreground">
                      {entry.startHour || entry.startMin
                        ? `${entry.startHour || "00"}:${entry.startMin || "00"} - ${entry.endHour || "00"}:${entry.endMin || "00"}`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => onRemove(entry.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onToggleCollapse(entry.id)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        value={entry.startDate}
                        onSelect={(d) => onUpdate(entry.id, { startDate: d })}
                        placeholder="Select date"
                        dateFormat="d MMM yyyy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Start Time <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="HH"
                          value={entry.startHour}
                          onChange={(e) =>
                            onUpdate(entry.id, { startHour: e.target.value })
                          }
                          className="rounded-lg"
                        />
                        <Input
                          placeholder="MM"
                          value={entry.startMin}
                          onChange={(e) =>
                            onUpdate(entry.id, { startMin: e.target.value })
                          }
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        value={entry.endDate}
                        onSelect={(d) => onUpdate(entry.id, { endDate: d })}
                        placeholder="Select date"
                        dateFormat="d MMM yyyy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        End Time <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="HH"
                          value={entry.endHour}
                          onChange={(e) =>
                            onUpdate(entry.id, { endHour: e.target.value })
                          }
                          className="rounded-lg"
                        />
                        <Input
                          placeholder="MM"
                          value={entry.endMin}
                          onChange={(e) =>
                            onUpdate(entry.id, { endMin: e.target.value })
                          }
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`have-end-${entry.id}`}
                      checked={entry.haveEndDate}
                      onCheckedChange={(checked) =>
                        onUpdate(entry.id, {
                          haveEndDate: checked === true,
                        })
                      }
                    />
                    <Label
                      htmlFor={`have-end-${entry.id}`}
                      className="text-sm font-normal"
                    >
                      Have End Date?
                    </Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => onRemove(entry.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onUpdate(entry.id, { isCollapsed: true })}
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
            {addButtonLabel}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
