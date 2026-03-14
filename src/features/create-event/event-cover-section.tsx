import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import { ImagePlus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

const UPLOAD_HINT = "Only .png, .jpeg (Max 10 MB)"

export interface EventCoverSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  posterPreview: string | null
  thumbnailPreview: string | null
  onPosterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPosterRemove: () => void
  onThumbnailRemove: () => void
}

export function EventCoverSection({
  sectionRef,
  posterPreview,
  thumbnailPreview,
  onPosterChange,
  onThumbnailChange,
  onPosterRemove,
  onThumbnailRemove,
}: EventCoverSectionProps) {
  const [activeDropZone, setActiveDropZone] = useState<
    "poster" | "thumbnail" | null
  >(null)
  const posterInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const createSyntheticChangeEvent = (
    file: File,
    target: "poster" | "thumbnail"
  ) => {
    const syntheticEvent = {
      target: { files: [file] },
      currentTarget: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    if (target === "poster") {
      onPosterChange(syntheticEvent)
      return
    }

    onThumbnailChange(syntheticEvent)
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLLabelElement>,
    target: "poster" | "thumbnail"
  ) => {
    e.preventDefault()
    setActiveDropZone(target)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setActiveDropZone(null)
  }

  const handleDrop = (
    e: React.DragEvent<HTMLLabelElement>,
    target: "poster" | "thumbnail"
  ) => {
    e.preventDefault()
    setActiveDropZone(null)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    createSyntheticChangeEvent(file, target)
  }

  return (
    <section
      ref={sectionRef}
      id={CREATE_EVENT_SIDEBAR_SECTIONS[0].id}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[37fr_180fr]">
        <div className="space-y-2">
          <Label className="text-sm">
            Poster <span className="text-destructive">*</span>
          </Label>
          <label
            className={`group relative flex aspect-2/3 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50 ${
              activeDropZone === "poster"
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
            onDragOver={(e) => handleDragOver(e, "poster")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "poster")}
          >
            {posterPreview ? (
              <>
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="size-full rounded-xl object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onPosterRemove()
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        posterInputRef.current?.click()
                      }}
                    >
                      Change image
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ImagePlus className="size-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload Poster
                </span>
                <p className="text-center text-[10px] text-muted-foreground">
                  {UPLOAD_HINT}
                </p>
              </>
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="sr-only"
              ref={posterInputRef}
              onChange={onPosterChange}
            />
          </label>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Thumbnail</Label>
          <label
            className={`group relative flex aspect-120/37 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50 ${
              activeDropZone === "thumbnail"
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
            onDragOver={(e) => handleDragOver(e, "thumbnail")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "thumbnail")}
          >
            {thumbnailPreview ? (
              <>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="size-full rounded-xl object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onThumbnailRemove()
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        thumbnailInputRef.current?.click()
                      }}
                    >
                      Change image
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ImagePlus className="size-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload Thumbnail
                </span>
                <p className="text-xs text-muted-foreground">{UPLOAD_HINT}</p>
              </>
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="sr-only"
              ref={thumbnailInputRef}
              onChange={onThumbnailChange}
            />
          </label>
        </div>
      </div>
    </section>
  )
}
