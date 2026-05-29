import { PageLayout } from "@/components/layouts/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStaffScanStore } from "@/stores/staff-scan-store"
import { formatDateLabel, formatTitleDate } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"
import { CheckCircle2, ChevronLeft, UserRoundCheck } from "lucide-react"
import { toast } from "sonner"

function formatCheckInTicketTypeLabel(
  name: string,
  eventDate?: string
): string {
  if (eventDate) {
    return `${name} (${formatDateLabel(eventDate)})`
  }

  return name
}

export default function StaffScanSuccessPage({
  eventId,
  code,
}: {
  eventId: string
  code: string
}) {
  const eventFromStore = useStaffScanStore((s) => s.event)
  const checkInResult = useStaffScanStore((s) => s.checkInResult)
  const resetStaffScan = useStaffScanStore((s) => s.reset)
  const event = eventFromStore
  const ticketType = checkInResult?.ticket_type
  const ticketTypeLabel = ticketType
    ? formatCheckInTicketTypeLabel(ticketType.name, ticketType.event_date)
    : "-"
  const qrValue = checkInResult?.ticket.qr_code ?? code

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto w-full max-w-[402px] px-4 py-4">
        <Link
          to="/staff/scan"
          search={{ eventId }}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          onClick={() => resetStaffScan()}
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        {event && (
          <div className="mt-3 space-y-1">
            <p className="text-lg font-medium tracking-tight text-foreground">
              {event.title}
            </p>
            <p className="text-base font-medium text-primary">
              {formatTitleDate(event.show_start_date)} -{" "}
              {formatTitleDate(event.show_end_date)}
            </p>
            <p className="text-sm text-muted-foreground">{event.venue}</p>
          </div>
        )}

        <Card className="mt-4 gap-0 py-4">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary">
              Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-2 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-green-500 p-4">
              <CheckCircle2 className="size-6 text-green-600" />
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  Ticket verified successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  You can now allow attendee entry.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg leading-7 text-foreground">
                Name:
                <span className="ml-2 font-medium">
                  {checkInResult?.user_name ?? "-"}
                </span>
              </p>
              <p className="text-base leading-7 text-foreground">
                Age:{" "}
                <span className="font-medium">
                  {checkInResult?.age != null ? checkInResult.age : "-"}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-lg font-medium text-primary">Ticket Type</p>
              <p className="text-base font-medium text-foreground">
                {ticketTypeLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {ticketType?.detail ?? "-"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                QR: {qrValue || "-"}
              </p>
            </div>

            <div className="flex justify-center pt-6 pb-2">
              <Button asChild size="lg">
                <Link
                  to="/staff/scan"
                  search={{ eventId }}
                  onClick={() => toast.success("Check in successfully")}
                >
                  <UserRoundCheck className="size-5" />
                  Check In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageLayout>
  )
}
