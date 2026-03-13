import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface TicketSettingSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  ticketMinPerOrder: string
  ticketMaxPerOrder: string
  onTicketMinChange: (value: string) => void
  onTicketMaxChange: (value: string) => void
}

export function TicketSettingSection({
  sectionRef,
  ticketMinPerOrder,
  ticketMaxPerOrder,
  onTicketMinChange,
  onTicketMaxChange,
}: TicketSettingSectionProps) {
  return (
    <section ref={sectionRef} id="ticket-setting">
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Ticket Setting</CardTitle>
          <p className="text-sm text-muted-foreground">
            Additional configuration settings for Tickets.
          </p>
          <p className="text-sm text-muted-foreground">
            Limit the number of ticket that can buy per order.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[160px] space-y-2">
              <Label>Minimum ticket</Label>
              <Select
                value={ticketMinPerOrder}
                onValueChange={onTicketMinChange}
              >
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[160px] space-y-2">
              <Label>Maximum ticket</Label>
              <Select
                value={ticketMaxPerOrder}
                onValueChange={onTicketMaxChange}
              >
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
