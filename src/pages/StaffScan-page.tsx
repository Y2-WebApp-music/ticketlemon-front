import { PageLayout } from "@/components/layouts/page-layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { getEventById } from "@/services/eventService"
import { checkInTicket, getTicketById } from "@/services/ticketService"
import { getUserById } from "@/services/staffService"
import { formatDateLabel, formatTitleDate } from "@/utils/formatDate"
import type { ApiEvent, ApiTicket } from "@/types/api-response"
import type { ErrorResponseProps } from "@/types/responseHandler"
import { useStaffScanStore } from "@/stores/staff-scan-store"
import { Link, useNavigate } from "@tanstack/react-router"
import jsQR from "jsqr"
import { ChevronLeft, CircleX, QrCode } from "lucide-react"
import * as React from "react"
import type { EventCardItem } from "@/types/event"

type DetectedBarcode = {
  rawValue?: string
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options: {
  formats: string[]
}) => BarcodeDetectorLike

interface DuplicateTicketInfo {
  name: string
  ticketType: string
  checkedInAt: string
}

function formatTicketTypeLabel(ticket: ApiTicket, event?: ApiEvent): string {
  if (!event) return ticket.type

  const matchedType = event.ticket_types.find(
    (item) => item.name === ticket.type
  )
  const eventDate = event.event_date_entries.find(
    (entry) => entry.id === matchedType?.use_for_event_date_time
  )

  if (eventDate?.start_date) {
    return `${ticket.type} (${formatDateLabel(eventDate.start_date)})`
  }

  return ticket.type
}

function isDuplicateCheckInError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  const err = error as ErrorResponseProps
  return /already checked in/i.test(String(err.message ?? ""))
}

export default function StaffScanPage({ eventId }: { eventId: string }) {
  type ScanResultType = "wrong" | "duplicate"
  const navigate = useNavigate()
  const eventFromStore = useStaffScanStore((s) => s.event)
  const eventDetailFromStore = useStaffScanStore((s) => s.eventDetail)
  const [event, setLocalEvent] = React.useState<EventCardItem | null>(
    eventFromStore ?? null
  )

  React.useEffect(() => {
    if (eventFromStore) {
      setLocalEvent(eventFromStore)
      return
    }

    navigate({ to: "/staff-sign-in", replace: true })
  }, [eventFromStore, navigate])
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const detectorRef = React.useRef<BarcodeDetectorLike | null>(null)
  const scanTimerRef = React.useRef<number | null>(null)
  const [status, setStatus] = React.useState<"idle" | "ready" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [lastScan, setLastScan] = React.useState<string>("")
  const [scanResult, setScanResult] = React.useState<ScanResultType | null>(
    null
  )
  const [duplicateInfo, setDuplicateInfo] =
    React.useState<DuplicateTicketInfo | null>(null)
  const [isCheckingIn, setIsCheckingIn] = React.useState(false)
  const isCheckingInRef = React.useRef(false)
  const [cameraDialogOpen, setCameraDialogOpen] = React.useState(false)
  const [scanSession, setScanSession] = React.useState(0)

  const stopScanning = React.useCallback(() => {
    if (scanTimerRef.current != null) {
      window.clearInterval(scanTimerRef.current)
      scanTimerRef.current = null
    }
    canvasRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const closeResultDialog = React.useCallback(() => {
    setScanResult(null)
    setDuplicateInfo(null)
    setScanSession((prev) => prev + 1)
  }, [])

  const loadDuplicateTicketInfo = React.useCallback(
    async (code: string): Promise<DuplicateTicketInfo | null> => {
      try {
        const ticket = await getTicketById(code)
        const activeEventId = eventFromStore?.event_id ?? eventId
        if (ticket.event_id !== activeEventId) return null

        const eventDetail =
          eventDetailFromStore?.id === ticket.event_id
            ? eventDetailFromStore
            : await getEventById(ticket.event_id)

        const user = await getUserById(ticket.user_id)

        const name = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(" ")
          .trim()

        return {
          name: name || user.email,
          ticketType: formatTicketTypeLabel(ticket, eventDetail),
          checkedInAt: ticket.updated_at
            ? formatDateLabel(ticket.updated_at)
            : "—",
        }
      } catch {
        return null
      }
    },
    [eventDetailFromStore, eventFromStore, eventId]
  )

  const retryCameraAccess = React.useCallback(() => {
    setCameraDialogOpen(false)
    setStatus("idle")
    setErrorMessage("")
    setScanSession((prev) => prev + 1)
  }, [])

  const onValidCode = React.useCallback(
    async (code: string) => {
      if (isCheckingInRef.current) return

      isCheckingInRef.current = true
      setIsCheckingIn(true)

      try {
        await checkInTicket(code)
      } catch (error) {
        stopScanning()

        if (isDuplicateCheckInError(error)) {
          const info = await loadDuplicateTicketInfo(code)
          setDuplicateInfo(info)
          setScanResult("duplicate")
        } else {
          setDuplicateInfo(null)
          setScanResult("wrong")
        }

        isCheckingInRef.current = false
        setIsCheckingIn(false)
        return
      }

      stopScanning()
      isCheckingInRef.current = false
      setIsCheckingIn(false)
      navigate({
        to: "/staff/scan-success",
        search: { eventId: eventFromStore?.event_id ?? eventId, code },
      })
    },
    [
      eventFromStore?.event_id,
      eventId,
      loadDuplicateTicketInfo,
      navigate,
      stopScanning,
    ]
  )

  const onScanCode = React.useCallback(
    async (code: string) => {
      await onValidCode(code)
    },
    [onValidCode]
  )

  React.useEffect(() => {
    let cancelled = false

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        })
        if (cancelled) return
        streamRef.current = stream
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        setStatus("ready")

        const BarcodeDetectorCtor = (
          window as Window & {
            BarcodeDetector?: BarcodeDetectorConstructor
          }
        ).BarcodeDetector
        detectorRef.current = BarcodeDetectorCtor
          ? new BarcodeDetectorCtor({ formats: ["qr_code"] })
          : null

        scanTimerRef.current = window.setInterval(async () => {
          const videoElement = videoRef.current
          if (!videoElement) return

          try {
            let rawValue = ""

            if (detectorRef.current) {
              const results = await detectorRef.current.detect(videoElement)
              if (!Array.isArray(results) || results.length === 0) return
              rawValue = String(results[0]?.rawValue ?? "").trim()
            } else {
              const width = videoElement.videoWidth
              const height = videoElement.videoHeight
              if (width <= 0 || height <= 0) return

              if (!canvasRef.current) {
                canvasRef.current = document.createElement("canvas")
              }

              const canvas = canvasRef.current
              canvas.width = width
              canvas.height = height
              const context = canvas.getContext("2d", {
                willReadFrequently: true,
              })
              if (!context) return

              context.drawImage(videoElement, 0, 0, width, height)
              const imageData = context.getImageData(0, 0, width, height)
              const decoded = jsQR(imageData.data, width, height, {
                inversionAttempts: "dontInvert",
              })
              rawValue = String(decoded?.data ?? "").trim()
            }

            if (!rawValue) return
            if (isCheckingInRef.current) return
            setLastScan(rawValue)
            void onScanCode(rawValue)
          } catch {
            // ignore detector frames errors
          }
        }, 500)
      } catch {
        setStatus("error")
        setErrorMessage(
          "Cannot access camera. Please allow camera permission and retry."
        )
        setCameraDialogOpen(true)
      }
    }

    start()
    return () => {
      cancelled = true
      stopScanning()
    }
  }, [onScanCode, scanSession, stopScanning])

  if (!event) {
    return (
      <PageLayout className="min-h-svh bg-muted/30">
        <main className="mx-auto max-w-[402px] px-4 py-6">
          <p className="text-sm text-muted-foreground">
            Loading event metadata...
          </p>
          <Link to="/staff-sign-in" className="mt-4 inline-flex text-primary">
            Back
          </Link>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto w-full max-w-[402px] px-4 py-4">
        <Link
          to="/staff-sign-in"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        <div className="mt-3 space-y-1">
          <p className="text-lg font-medium tracking-tight text-foreground">
            {event.title}
          </p>
          <p className="text-lg font-medium text-primary">
            {formatTitleDate(event.show_start_date)} -{" "}
            {formatTitleDate(event.show_end_date)}
          </p>
          <p className="text-sm text-muted-foreground">{event.venue}</p>
        </div>

        <div className="mt-6">
          <div className="relative mx-auto w-full max-w-[330px] overflow-hidden rounded-xl border-2 border-primary bg-background">
            <video
              ref={videoRef}
              className="aspect-square w-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {status !== "ready" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background text-[56px] leading-none font-medium text-foreground">
                <Spinner className="size-10" />
              </div>
            )}
          </div>
          {status === "error" && (
            <p className="mt-2 text-center text-xs text-destructive">
              {errorMessage}
            </p>
          )}
          {lastScan && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Last scanned: <span className="font-medium">{lastScan}</span>
            </p>
          )}
          {isCheckingIn && (
            <p className="mt-2 text-center text-xs text-primary">
              Checking ticket...
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              type="button"
              onClick={() => {
                const input = window.prompt("Enter scanned ticket id")
                if (!input) return
                void onValidCode(input.trim())
              }}
            >
              <QrCode className="size-4" />
              Enter Code
            </Button>
          </div>
        </div>
      </main>

      <Dialog
        open={scanResult !== null}
        onOpenChange={(open) => {
          if (!open) closeResultDialog()
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="bg-card px-6 py-8 sm:px-12 sm:py-10"
        >
          <DialogTitle className="sr-only">
            {scanResult === "duplicate" ? "Duplicate Ticket" : "Wrong QR Code"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {scanResult === "duplicate"
              ? "The ticket has already been used for check in."
              : "The scanned QR code does not match a valid ticket."}
          </DialogDescription>
          <div className="mx-auto flex flex-col items-center text-center">
            <CircleX className="size-12 text-red-600" />

            <p className="mt-4 text-xl leading-tight font-medium text-red-600 sm:text-2xl">
              {scanResult === "duplicate"
                ? "Duplicate Ticket"
                : "Wrong QR Code"}
            </p>

            {scanResult === "duplicate" ? (
              <div className="mt-8 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground sm:text-xl">
                    Name
                  </p>
                  <p className="text-base text-foreground sm:text-xl">
                    {duplicateInfo?.name ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground sm:text-xl">
                    Ticket Type
                  </p>
                  <p className="text-base text-foreground sm:text-xl">
                    {duplicateInfo?.ticketType ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground sm:text-xl">
                    Check In
                  </p>
                  <p className="text-base text-foreground sm:text-xl">
                    {duplicateInfo?.checkedInAt ?? "—"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 leading-tight text-muted-foreground sm:text-base">
                Ticket not found. Please scan again.
              </p>
            )}

            <Button
              type="button"
              size="lg"
              className="mt-6"
              onClick={closeResultDialog}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={cameraDialogOpen}
        onOpenChange={(open) => {
          setCameraDialogOpen(open)
        }}
      >
        <DialogContent className="">
          <DialogTitle className="sr-only">Allow camera access</DialogTitle>
          <DialogDescription className="sr-only">
            Allow camera permission in your browser settings to scan tickets.
          </DialogDescription>
          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground">
              Allow camera access
            </p>
            <p className="text-sm text-muted-foreground">
              To scan tickets, please allow camera permission for this website.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCameraDialogOpen(false)}
              >
                Close
              </Button>
              <Button type="button" onClick={retryCameraAccess}>
                Retry Camera
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
