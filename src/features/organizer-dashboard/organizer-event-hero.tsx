import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  EventStatus,
  getEventStatusBadgeVariant,
} from "@/constants/event-status.constant"
import type { EventDetail, EventTicketType } from "@/types/event"
import {
  formatDateLabel,
  formatDuration,
  getElapsedMs,
  getRemainingMs,
} from "@/utils/formatDate"
import {
  CalendarRange,
  Focus,
  MapPin,
  Pencil,
  Ticket,
  Upload,
  Users,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"

export interface OrganizerEventHeroProps {
  event: EventDetail
}

/** Returns current time, re-renders every intervalMs (for live countdown/duration). */
function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => dayjs())
  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/** Nearest sale date from now (soonest >= now, or first if all past). */
function getNearestSaleFromNow(
  saleDateList: string[]
): { date: string; label: string } | null {
  if (!saleDateList.length) return null
  const now = dayjs()
  const future = saleDateList
    .filter((d) => dayjs(d).isAfter(now))
    .sort((a, b) => dayjs(a).diff(dayjs(b)))
  const nearest = future[0] ?? saleDateList[0]
  return { date: nearest, label: future.length ? "First Sale" : "First Sale" }
}

/** For On Sale: sum remaining and total for ticket types whose start_sale_date is in sale_date_list and that sale date < now. */
function getOnSaleRemaining(
  saleDateList: string[],
  ticketTypes: EventTicketType[]
): { remaining: number; total: number } {
  const now = dayjs()
  const pastSaleSet = new Set(
    saleDateList
      .filter((d) => dayjs(d).isBefore(now) || dayjs(d).isSame(now, "minute"))
      .map((d) => d)
  )
  let remaining = 0
  let total = 0
  for (const tt of ticketTypes) {
    if (pastSaleSet.has(tt.start_sale_date)) {
      remaining += tt.remaining
      total += tt.total
    }
  }
  return { remaining, total }
}

/** For On Sale: start of current sale period = max(sale_date_list < now). */
function getTimeUseStart(saleDateList: string[]): string | null {
  const now = dayjs()
  const past = saleDateList
    .filter((d) => dayjs(d).isBefore(now))
    .sort((a, b) => dayjs(b).diff(dayjs(a)))
  return past[0] ?? null
}

/** Nearest show date in the future (for countdown). */
function getShowBeginTarget(showDateList: string[]): string | null {
  const now = dayjs()
  const future = showDateList
    .filter((d) => dayjs(d).isAfter(now))
    .sort((a, b) => dayjs(a).diff(dayjs(b)))
  return future[0] ?? null
}

/** Sum of (sold_out_date - start_sale_date) for each ticket type that has sold_out_date. */
function getTicketSaleTimeUseMs(ticketTypes: EventTicketType[]): number {
  let sum = 0
  for (const tt of ticketTypes) {
    if (tt.sold_out_date) {
      sum += Math.max(
        0,
        dayjs(tt.sold_out_date).diff(dayjs(tt.start_sale_date))
      )
    }
  }
  return sum
}

function InfoBlock({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext?: string
}) {
  return (
    <div className="mt-2 rounded-lg border border-border bg-background px-4 py-4 text-center first:mt-4">
      <p className="text-sm font-normal text-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
      {subtext != null && (
        <p className="mt-0.5 text-sm text-muted-foreground">{subtext}</p>
      )}
    </div>
  )
}

export function OrganizerEventHero({ event }: OrganizerEventHeroProps) {
  const formattedDates = event.show_date_list.map((iso) => formatDateLabel(iso))
  const statusBadgeVariant = getEventStatusBadgeVariant(event.status_id)
  const showLiveTime =
    event.status_id === EventStatus.ON_SALE ||
    event.status_id === EventStatus.SOLD_OUT ||
    event.status_id === EventStatus.SHOW
  const now = useNow(showLiveTime ? 1000 : 60_000)

  const statusCardData = useMemo(() => {
    const statusId = event.status_id
    if (statusId === EventStatus.CANCELLED) return null

    const saleDateList = event.sale_date_list ?? []
    const showDateList = event.show_date_list ?? []
    const ticketTypes = event.ticketTypes ?? []

    type Block = { key: string; label: string; value: string; subtext?: string }
    type ButtonConfig = {
      key: string
      label: string
      variant: "default" | "outline"
      icon: "focus" | "ticket" | "upload"
    }

    // Draft & Scheduled: Start sale (nearest sale_date from now)
    if (statusId === EventStatus.DRAFT || statusId === EventStatus.SCHEDULED) {
      const nearest = getNearestSaleFromNow(saleDateList)
      const blocks: Block[] = [
        {
          key: "start-sale",
          label: "Start sale",
          value: nearest ? formatDateLabel(nearest.date) : "—",
          subtext: nearest?.label ?? "—",
        },
      ]
      const buttons: ButtonConfig[] = [
        {
          key: "staff",
          label: "Staff Code",
          variant: "outline",
          icon: "focus",
        },
      ]
      return { blocks, buttons }
    }

    // On Sale
    if (statusId === EventStatus.ON_SALE) {
      const { remaining, total } = getOnSaleRemaining(saleDateList, ticketTypes)
      const timeUseStart = getTimeUseStart(saleDateList)
      const elapsedMs = timeUseStart ? getElapsedMs(timeUseStart, now) : 0
      const blocks: Block[] = [
        {
          key: "remaining",
          label: "Remaining Tickets",
          value: `${remaining.toLocaleString()} of ${total.toLocaleString()}`,
        },
        {
          key: "time-use",
          label: "Time use",
          value: formatDuration(elapsedMs),
          subtext: timeUseStart
            ? `from ${formatDateLabel(timeUseStart)}`
            : undefined,
        },
      ]
      const buttons: ButtonConfig[] = [
        {
          key: "see-selling",
          label: "See Selling",
          variant: "default",
          icon: "ticket",
        },
        {
          key: "staff",
          label: "Staff Code",
          variant: "outline",
          icon: "focus",
        },
      ]
      return { blocks, buttons }
    }

    // Sold Out
    if (statusId === EventStatus.SOLD_OUT) {
      const showBeginTarget = getShowBeginTarget(showDateList)
      const countdownMs = showBeginTarget ? getRemainingMs(showBeginTarget) : 0
      const ticketSaleTimeUseMs = getTicketSaleTimeUseMs(ticketTypes)
      const firstSale = saleDateList[0]
      const blocks: Block[] = [
        {
          key: "show-begin",
          label: "Show Begin",
          value: formatDuration(countdownMs),
          subtext: showBeginTarget
            ? `Round: ${formatDateLabel(showBeginTarget)}`
            : undefined,
        },
        {
          key: "ticket-sale-time",
          label: "Ticket Sale Time use",
          value: formatDuration(ticketSaleTimeUseMs),
          subtext: firstSale ? `from ${formatDateLabel(firstSale)}` : undefined,
        },
      ]
      const buttons: ButtonConfig[] = [
        {
          key: "staff",
          label: "Staff Code",
          variant: "outline",
          icon: "focus",
        },
        {
          key: "export",
          label: "Export Data",
          variant: "default",
          icon: "upload",
        },
      ]
      return { blocks, buttons }
    }

    // Show
    if (statusId === EventStatus.SHOW) {
      const showBeginTarget = getShowBeginTarget(showDateList)
      const countdownMs = showBeginTarget ? getRemainingMs(showBeginTarget) : 0
      const blocks: Block[] = [
        { key: "check-in", label: "Check In", value: "—", subtext: "TODO" },
        {
          key: "show-begin",
          label: "Show Begin",
          value: formatDuration(countdownMs),
          subtext: showBeginTarget
            ? `Round: ${formatDateLabel(showBeginTarget)}`
            : undefined,
        },
      ]
      const buttons: ButtonConfig[] = [
        {
          key: "staff",
          label: "Staff Code",
          variant: "outline",
          icon: "focus",
        },
      ]
      return { blocks, buttons }
    }

    // End
    if (statusId === EventStatus.END) {
      const blocks: Block[] = [
        { key: "check-in", label: "Check In", value: "—", subtext: "TODO" },
      ]
      const buttons: ButtonConfig[] = [
        {
          key: "export",
          label: "Export Data",
          variant: "default",
          icon: "upload",
        },
      ]
      return { blocks, buttons }
    }

    return { blocks: [] as Block[], buttons: [] as ButtonConfig[] }
  }, [event, now])

  const renderStatusButton = (config: {
    key: string
    label: string
    variant: "default" | "outline"
    icon: "focus" | "ticket" | "upload"
  }) => {
    const iconClass = "size-4"
    const outlineClass = "gap-2 border-primary text-primary hover:bg-primary/10"
    return (
      <Button
        key={config.key}
        variant={config.variant}
        className={config.variant === "outline" ? outlineClass : "gap-2"}
      >
        {config.icon === "focus" && <Focus className={iconClass} aria-hidden />}
        {config.icon === "ticket" && (
          <Ticket className={iconClass} aria-hidden />
        )}
        {config.icon === "upload" && (
          <Upload className={iconClass} aria-hidden />
        )}
        {config.label}
      </Button>
    )
  }
  return (
    <>
      <div className="relative h-[50vh] w-full sm:h-[460px]">
        <img
          src={event.poster_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-lg sm:blur-none"
        />
        <div className="absolute top-4 right-4">
          <Button variant="secondary" size="sm" className="gap-2">
            <Pencil className="size-4" aria-hidden />
            Edit Thumbnail
          </Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-8 sm:-mt-72 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:min-w-0 lg:flex-1">
            <div className="mx-auto w-full max-w-[240px] shrink-0 md:mx-0">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img
                  src={event.poster_url}
                  alt=""
                  className="aspect-200/300 w-full object-cover"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h1 className="text-xl leading-7 font-normal text-foreground sm:text-2xl">
                  {event.title}
                </h1>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="p-3 text-base" variant={statusBadgeVariant}>
                    {event.status_label}
                  </Badge>
                  <div className="flex grow items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      Unpublished Event
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pencil className="size-4" aria-hidden />
                      Edit Event
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CalendarRange
                      className="size-6 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                      {formattedDates.map((label, i) => (
                        <span key={i}>{label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      className="size-6 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="text-sm text-muted-foreground">
                      {event.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users
                      className="size-6 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="text-sm text-muted-foreground">
                      No age restriction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {event.status_id !== EventStatus.CANCELLED && statusCardData && (
            <div className="flex h-full items-center justify-center">
              <Card className="w-full shrink-0 gap-0 rounded-xl border border-border p-5 shadow-sm lg:sticky lg:top-24 lg:w-[280px]">
                <h2 className="text-center text-lg font-medium text-primary">
                  Event Status
                </h2>
                {statusCardData.blocks.map((block) => (
                  <InfoBlock
                    key={block.key}
                    label={block.label}
                    value={block.value}
                    subtext={block.subtext}
                  />
                ))}
                <div className="mt-2 flex items-center justify-center gap-2">
                  {statusCardData.buttons.map((btn) => renderStatusButton(btn))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
