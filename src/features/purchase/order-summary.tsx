import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { PurchaseOrderItem } from "@/types/purchase"

export interface OrderSummaryProps {
  eventTitle: string
  orderItems: PurchaseOrderItem[]
  total: number
  serviceFee: number
  paymentFee: number
  grandTotal: number
  acceptTerms: boolean
  onAcceptTermsChange: (checked: boolean) => void
  payDisabled?: boolean
  onPayNow?: () => void | Promise<void>
  isPaying?: boolean
}

export function OrderSummary({
  eventTitle,
  orderItems,
  total,
  serviceFee,
  paymentFee,
  grandTotal,
  acceptTerms,
  onAcceptTermsChange,
  payDisabled,
  onPayNow,
  isPaying,
}: OrderSummaryProps) {
  return (
    <aside className="w-full shrink-0 lg:w-[380px]">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="bg-primary px-5 py-4">
          <h2 className="text-lg font-medium text-primary-foreground">
            Order Summary
          </h2>
        </div>
        <div className="p-5">
          <p className="font-medium text-foreground">{eventTitle}</p>
        </div>
        <div className="border-t border-border" />
        <div className="divide-y divide-border">
          {orderItems.map((item, i) => (
            <div key={i} className="flex flex-col gap-1 px-5 py-3 text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-base text-muted-foreground">
                    {item.title} ({item.session_label})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.price} per ticket
                  </p>
                </div>
                <span className="shrink-0 font-medium">x{item.qty}</span>
              </div>
              <p className="font-medium">
                {item.line_total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                THB
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border px-5 py-3">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">SubTotal</span>
            <span className="font-medium">
              {total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}{" "}
              THB
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span>{serviceFee.toFixed(2)} THB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Fee</span>
            <span>{paymentFee.toFixed(2)} THB</span>
          </div>
        </div>
        <div className="border-t border-border bg-primary/10 px-5 py-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-medium tabular-nums">
                {grandTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                THB
              </span>
            </div>
            <label className="flex cursor-pointer items-start gap-2">
              <Checkbox
                className="mt-0.5"
                checked={acceptTerms}
                onCheckedChange={(v) => onAcceptTermsChange(v === true)}
              />
              <div className="text-sm">
                <span className="font-medium">Accept terms and condition</span>
                <p className="text-muted-foreground">
                  I agree to Ticketlemon's Terms of Service and Event
                  Organizer's Disclaimer. I accept that the items in this order
                  cannot be canceled and payments are non-refundable.
                </p>
              </div>
            </label>
            <Button
              className="w-full"
              size="lg"
              disabled={payDisabled || isPaying}
              onClick={() => void onPayNow?.()}
            >
              {isPaying ? "Processing..." : "Pay now"}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
