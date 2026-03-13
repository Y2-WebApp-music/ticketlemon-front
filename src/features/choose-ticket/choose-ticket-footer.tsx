import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { Ticket } from "lucide-react"
import type { PurchaseOrderItem } from "../purchase"

export interface ChooseTicketFooterProps {
  eventId: string
  total: number
  totalTickets: number
  summaryLines: string[]
  orderItems: PurchaseOrderItem[]
}

export function ChooseTicketFooter({
  eventId,
  total,
  totalTickets,
  summaryLines,
  orderItems,
}: ChooseTicketFooterProps) {
  return (
    <footer
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex flex-col justify-center",
        "bg-primary px-4 py-5 shadow-lg sm:px-6",
        "min-h-[90px] max-h-[240px] overflow-hidden"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-medium sm:text-xl">Total</span>
            <span className="text-xl font-medium tabular-nums sm:text-2xl">
              {total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              THB
            </span>
          </div>
          {totalTickets > 0 && (
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-medium">
                {totalTickets} Ticket{totalTickets !== 1 ? "s" : ""}:
              </span>
              <div className="max-h-[88px] overflow-auto pr-2 sm:max-h-[120px]">
                {summaryLines.map((line, i) => (
                  <span key={i} className="block text-white/90">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button
          asChild
          size="lg"
          className={cn(
            "shrink-0 bg-white text-primary hover:bg-white/90",
            "border border-primary/30"
          )}
        >
          <Link
            to="/events/$eventId/purchase"
            params={{ eventId }}
            state={
              // @ts-expect-error -- router state typed as history; we pass cart for purchase page
              { orderItems, total, totalTickets }
            }
          >
            <Ticket className="size-5" aria-hidden />
            Buy Tickets
          </Link>
        </Button>
      </div>
    </footer>
  )
}
