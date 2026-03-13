import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarRange, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
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
  const today = startOfDay(new Date())
  const hourOptions = Array.from({ length: 24 }, (_, idx) =>
    idx.toString().padStart(2, "0")
  )
  const minuteOptions = Array.from({ length: 60 }, (_, idx) =>
    idx.toString().padStart(2, "0")
  )

  const applyDateWithExistingTime = (
    selectedDate: Date | undefined,
    currentDate: Date | undefined
  ): Date | undefined => {
    if (!selectedDate) return undefined
    const next = new Date(selectedDate)
    if (currentDate) {
      next.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0)
    } else {
      next.setHours(0, 0, 0, 0)
    }
    return next
  }

  const applyTime = (
    currentDate: Date | undefined,
    hour: string,
    minute: string
  ): Date | undefined => {
    if (!currentDate) return undefined
    const next = new Date(currentDate)
    next.setHours(Number(hour), Number(minute), 0, 0)
    return next
  }

  const isPastDate = (date: Date): boolean => isBefore(startOfDay(date), today)

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
                      {entry.startDate
                        ? entry.haveEndDate && entry.endDate
                          ? `${format(entry.startDate, "HH:mm")} - ${format(entry.endDate, "HH:mm")}`
                          : format(entry.startDate, "HH:mm")
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
                        onSelect={(d) => {
                          if (!d || isPastDate(d)) {
                            onUpdate(entry.id, { startDate: undefined })
                            return
                          }
                          const nextStartDate = applyDateWithExistingTime(
                            d,
                            entry.startDate
                          )
                          if (!nextStartDate) {
                            onUpdate(entry.id, { startDate: undefined })
                            return
                          }
                          const shouldAdjustEndDate =
                            entry.haveEndDate &&
                            entry.endDate &&
                            isBefore(
                              startOfDay(entry.endDate),
                              startOfDay(nextStartDate)
                            )

                          onUpdate(entry.id, {
                            startDate: nextStartDate,
                            endDate: shouldAdjustEndDate
                              ? applyDateWithExistingTime(nextStartDate, entry.endDate)
                              : entry.endDate,
                          })
                        }}
                        placeholder="Select date"
                        dateFormat="d MMM yyyy"
                        disabledDates={{ before: today }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Start Time <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={
                            entry.startDate
                              ? format(entry.startDate, "HH")
                              : undefined
                          }
                          onValueChange={(hour) =>
                            onUpdate(entry.id, {
                              startDate: applyTime(
                                entry.startDate,
                                hour,
                                entry.startDate
                                  ? format(entry.startDate, "mm")
                                  : "00"
                              ),
                            })
                          }
                          disabled={!entry.startDate}
                        >
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                          <SelectContent>
                            {hourOptions.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={
                            entry.startDate
                              ? format(entry.startDate, "mm")
                              : undefined
                          }
                          onValueChange={(minute) =>
                            onUpdate(entry.id, {
                              startDate: applyTime(
                                entry.startDate,
                                entry.startDate
                                  ? format(entry.startDate, "HH")
                                  : "00",
                                minute
                              ),
                            })
                          }
                          disabled={!entry.startDate}
                        >
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {minuteOptions.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          endDate:
                            checked === true
                              ? entry.endDate ?? entry.startDate
                              : undefined,
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
                  {entry.haveEndDate && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>
                          End Date <span className="text-destructive">*</span>
                        </Label>
                        <DatePicker
                          value={entry.endDate}
                          onSelect={(d) =>
                            onUpdate(entry.id, {
                              endDate:
                                d &&
                                !isPastDate(d) &&
                                (!entry.startDate ||
                                  !isBefore(startOfDay(d), startOfDay(entry.startDate)))
                                  ? applyDateWithExistingTime(d, entry.endDate)
                                  : undefined,
                            })
                          }
                          placeholder="Select date"
                          dateFormat="d MMM yyyy"
                          disabledDates={
                            entry.startDate
                              ? { before: startOfDay(entry.startDate) }
                              : { before: today }
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          End Time <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={
                              entry.endDate
                                ? format(entry.endDate, "HH")
                                : undefined
                            }
                            onValueChange={(hour) =>
                              onUpdate(entry.id, {
                                endDate: applyTime(
                                  entry.endDate,
                                  hour,
                                  entry.endDate ? format(entry.endDate, "mm") : "00"
                                ),
                              })
                            }
                            disabled={!entry.endDate}
                          >
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="HH" />
                            </SelectTrigger>
                            <SelectContent>
                              {hourOptions.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={
                              entry.endDate
                                ? format(entry.endDate, "mm")
                                : undefined
                            }
                            onValueChange={(minute) =>
                              onUpdate(entry.id, {
                                endDate: applyTime(
                                  entry.endDate,
                                  entry.endDate ? format(entry.endDate, "HH") : "00",
                                  minute
                                ),
                              })
                            }
                            disabled={!entry.endDate}
                          >
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {minuteOptions.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
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
