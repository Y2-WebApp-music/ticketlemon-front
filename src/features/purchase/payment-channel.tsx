import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PaymentMethodId } from "./types"
import { CreditCard, QrCode, Wallet, WalletCards } from "lucide-react"
import { cn } from "@/lib/utils"

const PAYMENT_METHODS: {
  id: PaymentMethodId
  label: string
  icon: typeof CreditCard
}[] = [
  { id: "card", label: "Credit/Debit", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "promptpay", label: "PromptPay", icon: QrCode },
  { id: "truemoney", label: "TrueMoney Wallet", icon: WalletCards },
]

const CASH_BANKS = [
  "KBank",
  "SCB",
  "Bangkok Bank",
  "Krungsri",
  "TTB",
  "CIMB Thai",
  "GSB",
]

export interface PaymentChannelProps {
  paymentMethod: PaymentMethodId
  onPaymentMethodChange: (method: PaymentMethodId) => void
}

export function PaymentChannel({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentChannelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-medium tracking-tight text-foreground">
        Payment Channel
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onPaymentMethodChange(method.id)}
            className={cn(
              "flex min-w-[100px] flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors",
              paymentMethod === method.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted/50"
            )}
          >
            <method.icon className="size-10 shrink-0" />
            <span className="text-center text-sm font-medium">
              {method.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
        <p>Please proceed to checkout to receive payment slip.</p>
        <p className="mt-1">
          Payment must be completed{" "}
          <span className="font-semibold text-primary">within 30 minutes</span>{" "}
          to receive tickets.
        </p>
      </div>

      {paymentMethod === "card" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="card-number">
              Card Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-number"
              placeholder="**** **** **** ****"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name">
              Name On Card <span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-name"
              placeholder="Enter a Cardholder's Name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-expiry">
              Expiry Date <span className="text-destructive">*</span>
            </Label>
            <Input id="card-expiry" placeholder="MM/YY" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-cvv">
              CVV/CVC <span className="text-destructive">*</span>
            </Label>
            <Input id="card-cvv" placeholder="CVV/CVC" className="w-full" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="card-email">
              Cardholder's Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-email"
              type="email"
              placeholder="Enter Email"
              className="w-full"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 sm:col-span-2">
            <Checkbox />
            <span className="text-sm font-medium">Save this Card</span>
          </label>
        </div>
      )}

      {paymentMethod === "cash" && (
        <div className="mt-6 space-y-5">
          <div>
            <h3 className="text-base font-medium text-foreground">
              Available Channels
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ATM / Over the counter / iBanking
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CASH_BANKS.map((bank) => (
                <span
                  key={bank}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Over the counter
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              FamilyMart · B2S · Lawson 108 · Big C · CenPay · Central Food Hall
              · Tops Market · Robinson · Mpay · Central · TrueMoney ·
              Lotus&apos;s · Paypost Shop · Just Pay
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "promptpay" && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-foreground">
            How to pay with QR PromptPay
          </h3>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>
              Open the Mobile Banking application, then press &quot;Scan&quot;
            </li>
            <li>After Scanning, please review the payment amount</li>
            <li>Press confirm payment</li>
          </ol>
        </div>
      )}

      {paymentMethod === "truemoney" && (
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="truemoney-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="truemoney-phone"
              type="tel"
              placeholder="Enter your phone number"
              className="w-full max-w-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your phone number that is registered with TrueMoney Wallet.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">
              How to pay with TrueMoney
            </h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Enter the phone number registered with TrueMoney Wallet</li>
              <li>Enter the OTP received through SMS</li>
              <li>Confirm the payment amount and Make payment</li>
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
