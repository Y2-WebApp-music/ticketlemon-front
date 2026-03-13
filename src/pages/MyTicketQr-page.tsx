import { PageLayout } from "@/components/layouts"
import { getMyTicketDetail } from "@/mocks/my-ticket-detail"
import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export default function MyTicketQrPage({ ticketId }: { ticketId: string }) {
  const detail = getMyTicketDetail(ticketId)

  if (!detail) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-[402px] px-4 py-10">
          <p className="text-sm text-muted-foreground">Ticket not found.</p>
          <Link
            to="/my-tickets"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>
      </PageLayout>
    )
  }

  const ticketType = detail.ticketTypes.find((t) => t.variant === "unused")

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[402px] px-4 pb-16 pt-4">
        <Link
          to="/my-tickets/$ticketId"
          params={{ ticketId }}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </Link>

        <div className="mt-4 space-y-1">
          <p className="text-base font-medium leading-6 text-foreground">
            {detail.title}
          </p>
          <p className="text-base font-medium text-primary">{detail.date}</p>
          <p className="text-sm text-muted-foreground">{detail.venue}</p>
        </div>

        {/* QR Zone */}
        <div className="mt-8 flex justify-center">
          <div className="flex size-[320px] items-center justify-center rounded-xl border-4 border-primary bg-muted/30">
            <p className="text-3xl font-medium tracking-tight text-foreground">
              QR Zone
            </p>
          </div>
        </div>

        {/* Ticket Type */}
        <div className="mt-10 space-y-2">
          <p className="text-base font-medium text-primary">Ticket Type</p>
          <div className="space-y-1 text-sm">
            <p className="text-foreground">
              {ticketType?.title ?? "-"}
            </p>
            <p className="text-muted-foreground">
              {ticketType?.description ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

