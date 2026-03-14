import { Label } from "@/components/ui/label"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"
import { ImagePlus } from "lucide-react"

const UPLOAD_HINT = "Only .png, .jpeg (Max 10 MB)"

export interface EventCoverSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  posterPreview: string | null
  thumbnailPreview: string | null
  onPosterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EventCoverSection({
  sectionRef,
  posterPreview,
  thumbnailPreview,
  onPosterChange,
  onThumbnailChange,
}: EventCoverSectionProps) {
  return (
    <section
      ref={sectionRef}
      id={CREATE_EVENT_SIDEBAR_SECTIONS[0].id}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm">
            Poster <span className="text-destructive">*</span>
          </Label>
          <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50">
            {posterPreview ? (
              <img
                src={posterPreview}
                alt="Poster preview"
                className="size-full rounded-xl object-cover"
              />
            ) : (
              <>
                <ImagePlus className="size-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload Poster
                </span>
              </>
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="sr-only"
              onChange={onPosterChange}
            />
          </label>
          <p className="text-xs text-muted-foreground">{UPLOAD_HINT}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Thumbnail</Label>
          <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="size-full rounded-xl object-cover"
              />
            ) : (
              <>
                <ImagePlus className="size-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload Thumbnail
                </span>
              </>
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="sr-only"
              onChange={onThumbnailChange}
            />
          </label>
          <p className="text-xs text-muted-foreground">{UPLOAD_HINT}</p>
        </div>
      </div>
    </section>
  )
}
