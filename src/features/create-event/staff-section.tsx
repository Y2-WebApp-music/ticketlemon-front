import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CREATE_EVENT_SIDEBAR_SECTIONS } from "@/constants/create-event.constant"

export interface StaffSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  staffCode: string
  onStaffCodeChange: (value: string) => void
}

export function StaffSection({
  sectionRef,
  staffCode,
  onStaffCodeChange,
}: StaffSectionProps) {
  const generateStaffCode = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return Array.from(
      { length: 6 },
      () => charset[Math.floor(Math.random() * charset.length)]
    ).join("")
  }

  const normalizeCode = (value: string) =>
    value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6)

  return (
    <section
      ref={sectionRef}
      id={CREATE_EVENT_SIDEBAR_SECTIONS[7].id}
      className="space-y-4"
    >
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set reserve code for staff.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1 space-y-2 sm:max-w-xs">
              <Label>
                Reserve Code for staff{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code."
                  value={staffCode}
                  maxLength={6}
                  onChange={(e) =>
                    onStaffCodeChange(normalizeCode(e.target.value))
                  }
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0 text-primary hover:bg-primary/10"
                  onClick={() => onStaffCodeChange(generateStaffCode())}
                >
                  Generate Code
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
