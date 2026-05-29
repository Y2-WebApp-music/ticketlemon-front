import { PageLayout } from "@/components/layouts"
import { getTicketsByUserIdAndEventId } from "@/services/ticketService"
import { useUserStore } from "@/stores/user-store"
import type { MyTicketDetail } from "@/types/my-ticket"
import { formatDateLabel } from "@/utils/formatDate"
import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { toast } from "sonner"

export default function MyTicketQrPage({ eventId }: { eventId: string }) {
  const userId = useUserStore((state) => state.user_id)
  const [detail, setDetail] = useState<MyTicketDetail | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const response = await getTicketsByUserIdAndEventId(userId, eventId)
        setDetail(response)
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load ticket QR data"
        toast.error(message)
        setDetail(null)
      }
    }

    load()
  }, [eventId, userId])

  const ticketType = detail?.ticket_types.find((t) => !t.is_used)

  useEffect(() => {
    const generate = async () => {
      if (!ticketType?.id) {
        setQrImage(null)
        return
      }
      try {
        const url = await QRCode.toDataURL(ticketType.id, {
          width: 300,
          margin: 1,
        })
        setQrImage(url)
      } catch {
        setQrImage(null)
      }
    }

    generate()
  }, [ticketType?.id])

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

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[402px] px-4 pt-4 pb-16">
        <Link
          to="/my-tickets/$ticketId"
          params={{ ticketId: eventId }}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </Link>

        <div className="mt-4 space-y-1">
          <p className="text-base leading-6 font-medium text-foreground">
            {detail.title}
          </p>
          <p className="text-base font-medium text-primary">{`${formatDateLabel(detail.show_start_date)} - ${formatDateLabel(detail.show_end_date)}`}</p>
          <p className="text-sm text-muted-foreground">{detail.venue}</p>
        </div>

        {/* QR Zone */}
        <div className="mt-8 flex justify-center">
          <div className="flex size-[320px] items-center justify-center rounded-xl border-4 border-primary bg-muted/30 p-4">
            {qrImage ? (
              <img
                src={qrImage}
                alt="Ticket QR code"
                className="size-[280px]"
              />
            ) : (
              <p className="text-center font-mono text-sm break-all text-foreground">
                {ticketType?.id ?? "-"}
              </p>
            )}
          </div>
        </div>

        {/* Ticket Type */}
        <div className="mt-10 space-y-2">
          <p className="text-base font-medium text-primary">Ticket Type</p>
          <div className="space-y-1 text-sm">
            <p className="text-foreground">{ticketType?.title ?? "-"}</p>
            <p className="text-muted-foreground">
              {ticketType?.description ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
