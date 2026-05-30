import { PageLayout } from "@/components/layouts"
import { EditorJs, defaultEditorTools } from "@/components/editor-js"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TicketTypeCard } from "@/features/my-ticket-detail"
import { getTicketsByUserIdAndEventId } from "@/services/ticketService"
import { useUserStore } from "@/stores/user-store"
import type { MyTicketDetail } from "@/types/my-ticket"
import { formatDateLabel } from "@/utils/formatDate"
import { Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import * as React from "react"
import QRCode from "qrcode"
import { toast } from "sonner"
import type { OutputData } from "@editorjs/editorjs"

function toOutputData(raw: unknown): OutputData {
  if (!raw) return { time: Date.now(), version: "2.31.0", blocks: [] }

  if (typeof raw === "object" && raw !== null && "blocks" in raw) {
    const maybe = raw as Partial<OutputData>
    if (Array.isArray(maybe.blocks)) {
      return (
        (raw as OutputData) ?? {
          time: Date.now(),
          version: "2.31.0",
          blocks: [],
        }
      )
    }
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as OutputData
      if (parsed && Array.isArray(parsed.blocks)) return parsed
    } catch {
      // fallback to paragraph below
    }

    return {
      time: Date.now(),
      version: "2.31.0",
      blocks: [{ type: "paragraph", data: { text: raw } }],
    }
  }

  return { time: Date.now(), version: "2.31.0", blocks: [] }
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export default function MyTicketDetailPage({ eventId }: { eventId: string }) {
  const userId = useUserStore((state) => state.user_id)
  const [detail, setDetail] = React.useState<MyTicketDetail | null>(null)
  const navigate = useNavigate()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [qrOpen, setQrOpen] = React.useState(false)
  const [qrTicketTitle, setQrTicketTitle] = React.useState<string | null>(null)
  const [qrTicketDescription, setQrTicketDescription] = React.useState<
    string | null
  >(null)
  const [qrTicketValue, setQrTicketValue] = React.useState<string | null>(null)
  const [qrTicketImage, setQrTicketImage] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const response = await getTicketsByUserIdAndEventId(userId, eventId)
        setDetail({
          ...response,
          description: toOutputData(response.description),
        })
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load ticket detail"
        toast.error(message)
        setDetail(null)
      }
    }

    load()
  }, [eventId, userId])

  React.useEffect(() => {
    const generate = async () => {
      if (!qrTicketValue) {
        setQrTicketImage(null)
        return
      }
      try {
        const url = await QRCode.toDataURL(qrTicketValue, {
          width: 300,
          margin: 1,
        })
        setQrTicketImage(url)
      } catch {
        setQrTicketImage(null)
      }
    }

    generate()
  }, [qrTicketValue])

  if (!detail) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
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
      {/* Mobile hero image */}
      <div className="relative sm:hidden">
        <img
          src={detail.poster_url}
          alt=""
          className="h-[125px] w-full object-cover"
        />
        <Link
          to="/my-tickets"
          className="absolute top-2 left-2 inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-primary backdrop-blur"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-[1336px] min-w-0 px-4 pt-6 pb-20 sm:px-6">
        {/* Desktop back */}
        <div className="hidden sm:block">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,706px)_minmax(0,610px)] lg:items-start">
          {/* Left column */}
          <div className="space-y-4">
            {/* Desktop hero image */}
            <div className="hidden overflow-hidden rounded-xl sm:block">
              <img
                src={detail.poster_url}
                alt=""
                className="h-[220px] w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-base leading-6 font-medium text-foreground sm:text-xl sm:leading-7 sm:tracking-tight">
                {detail.title}
              </p>
              <p className="text-base font-medium text-primary sm:text-base">
                {formatDateLabel(detail.show_start_date)} -{" "}
                {formatDateLabel(detail.show_end_date)}
              </p>
              <p className="text-sm text-muted-foreground">{detail.venue}</p>
              <div className="h-px w-full bg-border" aria-hidden />
            </div>

            <div className="hidden space-y-2 sm:block">
              <p className="text-xl leading-7 font-medium text-foreground">
                Description
              </p>
              <EditorJs
                key="my-ticket-desc"
                readOnly
                initialData={detail.description}
                tools={defaultEditorTools}
                minHeight={200}
                className="min-h-[200px]"
              />
            </div>
          </div>

          {/* Right column: tickets (desktop sticky), mobile: appears below header */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <p className="text-lg font-medium text-primary sm:text-xl sm:leading-7 sm:tracking-tight">
              Your Ticket
            </p>
            <div className="space-y-4">
              {detail.ticket_types.map((t, i) => (
                <TicketTypeCard
                  key={i}
                  {...t}
                  onClick={
                    !t.is_used
                      ? () => {
                          setQrTicketTitle(
                            `${t.title} ${formatDateLabel(t.event_date)}`
                          )
                          setQrTicketDescription(t.description)
                          setQrTicketValue(t.id)
                          if (isDesktop) {
                            setQrOpen(true)
                          } else {
                            navigate({
                              to: "/my-tickets/$ticketId/qr",
                              params: { ticketId: eventId },
                            })
                          }
                        }
                      : undefined
                  }
                  onViewQr={
                    !t.is_used
                      ? () => {
                          setQrTicketTitle(
                            `${t.title} ${formatDateLabel(t.event_date)}`
                          )
                          setQrTicketDescription(t.description)
                          setQrTicketValue(t.id)
                          setQrOpen(true)
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop QR dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">QR</p>
              <p className="text-xs text-muted-foreground">
                {qrTicketTitle ?? ""}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="flex size-[320px] items-center justify-center rounded-xl border-4 border-primary bg-muted/30 p-4">
                {qrTicketImage ? (
                  <img
                    src={qrTicketImage}
                    alt="Ticket QR code"
                    className="size-[280px]"
                  />
                ) : (
                  <p className="text-center font-mono text-sm break-all text-foreground">
                    {qrTicketValue ?? "-"}
                  </p>
                )}
              </div>
            </div>

            {qrTicketDescription && (
              <p className="text-sm text-muted-foreground">
                {qrTicketDescription}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
