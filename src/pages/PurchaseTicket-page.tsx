import { PageLayout } from "@/components/layouts"
import { DEFAULT_PHONE_REGION } from "@/constants/phone-region.constant"
import {
  OrderSummary,
  PaymentChannel,
  PurchaseContactForm,
  PurchaseImportant,
  type PaymentMethodId,
  type PurchaseCartState,
} from "@/features/purchase"
import { getEventDetail } from "@/mocks/event-detail"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useMemo, useState } from "react"

export interface PurchaseTicketPageProps {
  eventId: string
}

export default function PurchaseTicketPage({
  eventId,
}: PurchaseTicketPageProps) {
  const event = getEventDetail(eventId)
  const location = useLocation()
  const cart = location.state as unknown as PurchaseCartState | undefined
  const orderItems = cart?.orderItems ?? []
  const total = cart?.total ?? 0
  const serviceFee = 10.5
  const paymentFee = 25
  const grandTotal = total + serviceFee + paymentFee
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>(
    DEFAULT_PHONE_REGION.dialCode
  )
  const [acceptTerms, setAcceptTerms] = useState(false)

  const { emailError, phoneError, canPay } = useMemo(() => {
    const emailTrim = email.trim()
    const phoneTrim = phone.trim()

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
    const phoneOk = /^\d{1,13}$/.test(phoneTrim)

    return {
      emailError: emailTrim.length === 0 ? "Email is required." : emailOk ? undefined : "Enter a valid email.",
      phoneError: phoneTrim.length === 0 ? "Mobile Phone is required." : phoneOk ? undefined : "Phone number must be digits only (max 13).",
      canPay: emailOk && phoneOk && acceptTerms,
    }
  }, [acceptTerms, email, phone])

  if (!event) {
    return (
      <PageLayout>
        <main className="flex min-h-[50vh] flex-col items-center justify-center px-4">
          <p className="text-muted-foreground">Event not found.</p>
          <Link to="/" className="mt-4 text-primary hover:underline">
            Back to home
          </Link>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
          <Link
            to="/events/$eventId/choose"
            params={{ eventId }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-6" aria-hidden />
            Back
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-6">
              <PurchaseContactForm
                email={email}
                phone={phone}
                phoneCountryCode={phoneCountryCode}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                onPhoneCountryCodeChange={setPhoneCountryCode}
                emailError={emailError}
                phoneError={phoneError}
              />
              <PaymentChannel
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
              <PurchaseImportant />
            </div>

            <OrderSummary
              eventTitle={event.title}
              orderItems={orderItems}
              total={total}
              serviceFee={serviceFee}
              paymentFee={paymentFee}
              grandTotal={grandTotal}
              acceptTerms={acceptTerms}
              onAcceptTermsChange={setAcceptTerms}
              payDisabled={!canPay}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
