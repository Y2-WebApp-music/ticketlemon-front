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
import {
  CREATE_EVENT_CATEGORY_OPTIONS,
  CREATE_EVENT_IMPACT_GENRE_OPTIONS,
  CREATE_EVENT_SIDEBAR_SECTIONS,
} from "@/constants/create-event.constant"

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
    <section
      ref={sectionRef}
      id={CREATE_EVENT_SIDEBAR_SECTIONS[1].id}
      className="space-y-4"
    >
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
                  {CREATE_EVENT_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Venue <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Bangkok"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Impact/Genre</Label>
            <Select value={impactGenre} onValueChange={onImpactGenreChange}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="KPOP, Korea" />
              </SelectTrigger>
              <SelectContent>
                {CREATE_EVENT_IMPACT_GENRE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
