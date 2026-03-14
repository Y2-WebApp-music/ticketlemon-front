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
import {
  CalendarDays,
  CalendarRange,
  Clock3,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
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
    <section ref={sectionRef} id={id} className="space-y-4">
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
              {entry.is_collapsed ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary"
                    aria-hidden
                  >
                    <CalendarRange className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-lg leading-7 font-medium text-foreground">
                      {entry.start_date
                        ? format(entry.start_date, "d MMM yyyy")
                        : "—"}
                    </p>
                    <p className="text-base leading-6 text-muted-foreground">
                      {entry.start_date
                        ? entry.have_end_date && entry.end_date
                          ? `${format(entry.start_date, "HH:mm")} - ${format(entry.end_date, "HH:mm")}`
                          : format(entry.start_date, "HH:mm")
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
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                        <DatePicker
                          value={entry.start_date}
                          onSelect={(d) => {
                            if (!d || isPastDate(d)) {
                              onUpdate(entry.id, { start_date: undefined })
                              return
                            }
                            const nextStartDate = applyDateWithExistingTime(
                              d,
                              entry.start_date
                            )
                            if (!nextStartDate) {
                              onUpdate(entry.id, { start_date: undefined })
                              return
                            }
                            const shouldAdjustEndDate =
                              entry.have_end_date &&
                              entry.end_date &&
                              isBefore(
                                startOfDay(entry.end_date),
                                startOfDay(nextStartDate)
                              )

                            onUpdate(entry.id, {
                              start_date: nextStartDate,
                              end_date: shouldAdjustEndDate
                                ? applyDateWithExistingTime(
                                    nextStartDate,
                                    entry.end_date
                                  )
                                : entry.end_date,
                            })
                          }}
                          placeholder="Select date"
                          dateFormat="d MMM yyyy"
                          disabledDates={{ before: today }}
                          triggerClassName="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Start Time <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={
                            entry.start_date
                              ? format(entry.start_date, "HH")
                              : undefined
                          }
                          onValueChange={(hour) =>
                            onUpdate(entry.id, {
                              start_date: applyTime(
                                entry.start_date,
                                hour,
                                entry.start_date
                                  ? format(entry.start_date, "mm")
                                  : "00"
                              ),
                            })
                          }
                          disabled={!entry.start_date}
                        >
                          <SelectTrigger className="w-full rounded-lg">
                            <Clock3 className="size-4 text-muted-foreground" />
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
                            entry.start_date
                              ? format(entry.start_date, "mm")
                              : undefined
                          }
                          onValueChange={(minute) =>
                            onUpdate(entry.id, {
                              start_date: applyTime(
                                entry.start_date,
                                entry.start_date
                                  ? format(entry.start_date, "HH")
                                  : "00",
                                minute
                              ),
                            })
                          }
                          disabled={!entry.start_date}
                        >
                          <SelectTrigger className="w-full rounded-lg">
                            <Clock3 className="size-4 text-muted-foreground" />
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
                      checked={entry.have_end_date}
                      onCheckedChange={(checked) =>
                        onUpdate(entry.id, {
                          have_end_date: checked === true,
                          end_date:
                            checked === true
                              ? (entry.end_date ?? entry.start_date)
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
                  {entry.have_end_date && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>
                          End Date <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                          <DatePicker
                            value={entry.end_date}
                            onSelect={(d) =>
                              onUpdate(entry.id, {
                                end_date:
                                  d &&
                                  !isPastDate(d) &&
                                  (!entry.start_date ||
                                    !isBefore(
                                      startOfDay(d),
                                      startOfDay(entry.start_date)
                                    ))
                                    ? applyDateWithExistingTime(
                                        d,
                                        entry.end_date
                                      )
                                    : undefined,
                              })
                            }
                            placeholder="Select date"
                            dateFormat="d MMM yyyy"
                            disabledDates={
                              entry.start_date
                                ? { before: startOfDay(entry.start_date) }
                                : { before: today }
                            }
                            triggerClassName="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>
                          End Time <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={
                              entry.end_date
                                ? format(entry.end_date, "HH")
                                : undefined
                            }
                            onValueChange={(hour) =>
                              onUpdate(entry.id, {
                                end_date: applyTime(
                                  entry.end_date,
                                  hour,
                                  entry.end_date
                                    ? format(entry.end_date, "mm")
                                    : "00"
                                ),
                              })
                            }
                            disabled={!entry.end_date}
                          >
                            <SelectTrigger className="w-full rounded-lg">
                              <Clock3 className="size-4 text-muted-foreground" />
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
                              entry.end_date
                                ? format(entry.end_date, "mm")
                                : undefined
                            }
                            onValueChange={(minute) =>
                              onUpdate(entry.id, {
                                end_date: applyTime(
                                  entry.end_date,
                                  entry.end_date
                                    ? format(entry.end_date, "HH")
                                    : "00",
                                  minute
                                ),
                              })
                            }
                            disabled={!entry.end_date}
                          >
                            <SelectTrigger className="w-full rounded-lg">
                              <Clock3 className="size-4 text-muted-foreground" />
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
                      onClick={() => onUpdate(entry.id, { is_collapsed: true })}
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
