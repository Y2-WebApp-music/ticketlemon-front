import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Trash2 } from "lucide-react"
import type { StaffEntry } from "@/types/create-event"

export interface StaffSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  staffEntries: StaffEntry[]
  onUpdate: (id: string, patch: Partial<StaffEntry>) => void
  onAdd: () => void
  onRemove: (id: string) => void
}

export function StaffSection({
  sectionRef,
  staffEntries,
  onUpdate,
  onAdd,
  onRemove,
}: StaffSectionProps) {
  return (
    <section ref={sectionRef} id="staff">
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add staff members with reserve codes and email.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {staffEntries.map((staff) => (
            <div
              key={staff.id}
              className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-0 flex-1 space-y-2 sm:max-w-xs">
                    <Label>
                      Reserve Code for staff{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code."
                        value={staff.reserveCode}
                        onChange={(e) =>
                          onUpdate(staff.id, {
                            reserveCode: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="shrink-0 text-primary hover:bg-primary/10"
                      >
                        Generate Code
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="max-w-md space-y-2">
                  <Label>
                    Staff Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Example F1234@gmail.com"
                    value={staff.email}
                    onChange={(e) =>
                      onUpdate(staff.id, {
                        email: e.target.value,
                      })
                    }
                    className="rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    User from Code and password.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => onRemove(staff.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                  <Button type="button">
                    <Save className="size-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="text-primary hover:bg-primary/10"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            Add Staff
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
