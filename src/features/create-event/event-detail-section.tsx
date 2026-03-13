import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface EventDetailSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  eventName: string
  category: string
  location: string
  impactGenre: string
  ageRestriction: string
  onEventNameChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onImpactGenreChange: (value: string) => void
  onAgeRestrictionChange: (value: string) => void
}

export function EventDetailSection({
  sectionRef,
  eventName,
  category,
  location,
  impactGenre,
  ageRestriction,
  onEventNameChange,
  onCategoryChange,
  onLocationChange,
  onImpactGenreChange,
  onAgeRestrictionChange,
}: EventDetailSectionProps) {
  return (
    <section ref={sectionRef} id="event-name">
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Event Detail</CardTitle>
          <p className="text-sm text-muted-foreground">
            Give your event detail.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-name"
              placeholder="LEE DONG WOOK 2023-2024 FANMEETING TOUR [MY SWEET HOME] in Bangkok, 2024."
              value={eventName}
              onChange={(e) => onEventNameChange(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Location <span className="text-destructive">*</span>
              </Label>
              <Select value={location} onValueChange={onLocationChange}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangkok">Bangkok</SelectItem>
                  <SelectItem value="chiang-mai">Chiang Mai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Impact/Genre</Label>
            <Select value={impactGenre} onValueChange={onImpactGenreChange}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="KPOP, Korea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kpop">KPOP, Korea</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Age Restriction <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="No"
              value={ageRestriction}
              onChange={(e) => onAgeRestrictionChange(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
