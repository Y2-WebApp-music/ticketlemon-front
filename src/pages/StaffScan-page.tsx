import { PageLayout } from "@/components/layouts/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
  getStaffEventById,
  STAFF_DUPLICATE_SCAN_CODE,
  STAFF_VALID_SCAN_CODE,
} from "@/mocks/staff"
import { Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, CircleX, QrCode } from "lucide-react"
import * as React from "react"

type DetectedBarcode = {
  rawValue?: string
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options: {
  formats: string[]
}) => BarcodeDetectorLike

export default function StaffScanPage({ eventId }: { eventId: string }) {
  type ScanResultType = "wrong" | "duplicate"
  const navigate = useNavigate()
  const event = getStaffEventById(eventId)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const detectorRef = React.useRef<BarcodeDetectorLike | null>(null)
  const scanTimerRef = React.useRef<number | null>(null)
  const [status, setStatus] = React.useState<"idle" | "ready" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [lastScan, setLastScan] = React.useState<string>("")
  const [scanResult, setScanResult] = React.useState<ScanResultType | null>(
    null
  )
  const [cameraDialogOpen, setCameraDialogOpen] = React.useState(false)
  const [scanSession, setScanSession] = React.useState(0)

  const stopScanning = React.useCallback(() => {
    if (scanTimerRef.current != null) {
      window.clearInterval(scanTimerRef.current)
      scanTimerRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const closeResultDialog = React.useCallback(() => {
    setScanResult(null)
    setScanSession((prev) => prev + 1)
  }, [])

  const retryCameraAccess = React.useCallback(() => {
    setCameraDialogOpen(false)
    setStatus("idle")
    setErrorMessage("")
    setScanSession((prev) => prev + 1)
  }, [])

  const onValidCode = React.useCallback(
    (code: string) => {
      stopScanning()
      navigate({
        to: "/staff/scan-success",
        search: { eventId, code },
      })
    },
    [eventId, navigate, stopScanning]
  )

  const onScanCode = React.useCallback(
    (code: string) => {
      if (code === STAFF_VALID_SCAN_CODE) {
        onValidCode(code)
        return
      }

      stopScanning()
      setScanResult(code === STAFF_DUPLICATE_SCAN_CODE ? "duplicate" : "wrong")
    },
    [onValidCode, stopScanning]
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
        if (!BarcodeDetectorCtor) return
        detectorRef.current = new BarcodeDetectorCtor({ formats: ["qr_code"] })

        scanTimerRef.current = window.setInterval(async () => {
          if (!videoRef.current || !detectorRef.current) return
          try {
            const results = await detectorRef.current.detect(videoRef.current)
            if (!Array.isArray(results) || results.length === 0) return
            const rawValue = String(results[0]?.rawValue ?? "").trim()
            if (!rawValue) return
            setLastScan(rawValue)
            onScanCode(rawValue)
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
          <p className="text-sm text-muted-foreground">Event not found.</p>
          <Link to="/staff" className="mt-4 inline-flex text-primary">
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
          to="/staff"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        <div className="mt-3 space-y-1">
          <p className="text-lg font-medium tracking-tight text-foreground">
            {event.title}
          </p>
          <p className="text-lg font-medium text-primary">{event.dateRange}</p>
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
              {/* Last scanned: <span className="font-medium">{lastScan}</span> */}
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              type="button"
              onClick={() => onValidCode(STAFF_VALID_SCAN_CODE)}
            >
              <QrCode className="size-4" />
              Enter Code
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="text-xs"
              onClick={() => onScanCode(STAFF_DUPLICATE_SCAN_CODE)}
            >
              Dev: Duplicate
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="text-xs"
              onClick={() => {
                stopScanning()
                setScanResult("duplicate")
              }}
            >
              Dev: Show Duplicate Dialog
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="text-xs"
              onClick={() => onScanCode("TICKETLEMON_STAFF_WRONG_QR")}
            >
              Dev: Wrong QR
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
                    Chotanansub Sophaken
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground sm:text-xl">
                    Ticket Type
                  </p>
                  <p className="text-base text-foreground sm:text-xl">
                    VVIP + Soundcheck (29 Mar 2026, 17:00)
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground sm:text-xl">
                    Check In
                  </p>
                  <p className="text-base text-foreground sm:text-xl">
                    29 Mar 2026, 16:24:35
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 leading-tight text-muted-foreground sm:text-base">
                QR code not recognized. Please scan again.
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
          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground">
              Allow camera access
            </p>
            <p className="text-sm text-muted-foreground">
              To scan tickets, please allow camera permission for this website.
            </p>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              iPhone Safari: tap <span className="font-medium">aA</span> in the
              address bar, open{" "}
              <span className="font-medium">Website Settings</span>, set{" "}
              <span className="font-medium">Camera</span> to{" "}
              <span className="font-medium">Allow</span>, then come back and
              retry.
            </div>
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
