import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEFAULT_PHONE_REGION,
  PHONE_REGIONS,
  ensureDialCode,
  formatPhoneRegionLabel,
} from "@/constants/phone-region.constant"

export interface PurchaseContactFormProps {
  email: string
  phone: string
  phoneCountryCode: string
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onPhoneCountryCodeChange: (value: string) => void
  emailError?: string
  phoneError?: string
}

export function PurchaseContactForm({
  email,
  phone,
  phoneCountryCode,
  onEmailChange,
  onPhoneChange,
  onPhoneCountryCodeChange,
  emailError,
  phoneError,
}: PurchaseContactFormProps) {
  const safeDialCode = ensureDialCode(phoneCountryCode, DEFAULT_PHONE_REGION)

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-medium tracking-tight text-foreground">
        Contact Information
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Please verify or fill out the information used to send tickets to this
        email address.
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="purchase-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <InputGroup className="w-full">
            <InputGroupInput
              id="purchase-email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              aria-invalid={emailError ? true : undefined}
            />
          </InputGroup>
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </div>
        <div className="w-full space-y-2 sm:max-w-[300px]">
          <Label htmlFor="purchase-phone">
            Mobile Phone <span className="text-destructive">*</span>
          </Label>
          <InputGroup className="w-full" data-disabled={false}>
            <InputGroupAddon align="inline-start" className="px-1.5">
              <Select
                value={safeDialCode}
                onValueChange={onPhoneCountryCodeChange}
              >
                <SelectTrigger
                  size="sm"
                  className="h-7 border-0 bg-transparent py-0 pr-1 pl-1.5 shadow-none focus-visible:ring-0"
                  aria-label="Country code"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_REGIONS.map((r) => (
                    <SelectItem key={r.iso2} value={r.dialCode}>
                      {formatPhoneRegionLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroupAddon>
            <InputGroupInput
              id="purchase-phone"
              type="tel"
              placeholder="Please enter phone number"
              required
              value={phone}
              inputMode="numeric"
              pattern="\d*"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 13)
                onPhoneChange(digitsOnly)
              }}
              aria-invalid={phoneError ? true : undefined}
              className="pl-1"
            />
          </InputGroup>
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </div>
      </div>
    </section>
  )
}
