import { PageLayout } from "@/components/layouts"
import { DEFAULT_PHONE_REGION } from "@/constants/phone-region.constant"
import {
  OrderSummary,
  PaymentChannel,
  PurchaseContactForm,
  PurchaseImportant,
} from "@/features/purchase"
import { getEventById } from "@/services/eventService"
import type { PurchaseCartState, PurchaseFormPayload } from "@/types/purchase"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export interface PurchaseTicketPageProps {
  eventId: string
}

export default function PurchaseTicketPage({
  eventId,
}: PurchaseTicketPageProps) {
  const [eventTitle, setEventTitle] = useState<string>("")
  const [eventFound, setEventFound] = useState(true)
  const location = useLocation()
  const purchasePayload = useMemo(() => {
    const cart = location.state as unknown as PurchaseCartState | undefined
    const orderItems = cart?.order_items ?? []
    const total = cart?.total ?? 0
    const serviceFee = 10.5
    const paymentFee = 25

    return {
      orderItems,
      total,
      totalTickets: cart?.total_tickets ?? 0,
      serviceFee,
      paymentFee,
      grandTotal: total + serviceFee + paymentFee,
    }
  }, [location.state])

  const [formPayload, setFormPayload] = useState<PurchaseFormPayload>({
    payment_method: "card",
    email: "",
    phone: "",
    phone_country_code: DEFAULT_PHONE_REGION.dialCode,
    accept_terms: false,
  })

  const { emailError, phoneError, canPay } = useMemo(() => {
    const emailTrim = formPayload.email.trim()
    const phoneTrim = formPayload.phone.trim()

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
    const phoneOk = /^\d{1,13}$/.test(phoneTrim)

    return {
      emailError:
        emailTrim.length === 0
          ? "Email is required."
          : emailOk
            ? undefined
            : "Enter a valid email.",
      phoneError:
        phoneTrim.length === 0
          ? "Mobile Phone is required."
          : phoneOk
            ? undefined
            : "Phone number must be digits only (max 13).",
      canPay: emailOk && phoneOk && formPayload.accept_terms,
    }
  }, [formPayload.accept_terms, formPayload.email, formPayload.phone])

  useEffect(() => {
    const load = async () => {
      try {
        const event = await getEventById(eventId)
        setEventTitle(event.event_name)
        setEventFound(true)
      } catch (error) {
        setEventFound(false)
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load event"
        toast.error(message)
      }
    }

    load()
  }, [eventId])

  if (!eventFound) {
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
            to="/events/$eventId"
            params={{ eventId }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-6" aria-hidden />
            Back
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-6">
              <PurchaseContactForm
                email={formPayload.email}
                phone={formPayload.phone}
                phoneCountryCode={formPayload.phone_country_code}
                onEmailChange={(value) =>
                  setFormPayload((prev) => ({ ...prev, email: value }))
                }
                onPhoneChange={(value) =>
                  setFormPayload((prev) => ({ ...prev, phone: value }))
                }
                onPhoneCountryCodeChange={(value) =>
                  setFormPayload((prev) => ({
                    ...prev,
                    phone_country_code: value,
                  }))
                }
                emailError={emailError}
                phoneError={phoneError}
              />
              <PaymentChannel
                paymentMethod={formPayload.payment_method}
                onPaymentMethodChange={(method) =>
                  setFormPayload((prev) => ({
                    ...prev,
                    payment_method: method,
                  }))
                }
              />
              <PurchaseImportant />
            </div>

            <OrderSummary
              eventTitle={eventTitle}
              orderItems={purchasePayload.orderItems}
              total={purchasePayload.total}
              serviceFee={purchasePayload.serviceFee}
              paymentFee={purchasePayload.paymentFee}
              grandTotal={purchasePayload.grandTotal}
              acceptTerms={formPayload.accept_terms}
              onAcceptTermsChange={(checked) =>
                setFormPayload((prev) => ({ ...prev, accept_terms: checked }))
              }
              payDisabled={!canPay}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
