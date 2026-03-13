import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { ChevronLeftIcon } from "lucide-react"
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
import * as React from "react"
import {
  DEFAULT_PHONE_REGION,
  PHONE_REGIONS,
  ensureDialCode,
  formatPhoneRegionLabel,
} from "@/constants/phone-region.constant"
import type { RegisterDataForm } from "./register-types"

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

export type { RegisterStep2DataForm } from "./register-types"

export interface RegisterStep2FormProps {
  idPrefix: string
  dataForm: RegisterDataForm
  onDataFormChange: React.Dispatch<React.SetStateAction<RegisterDataForm>>
  onBack: () => void
  onContinue: () => void
  onSignIn: () => void
  variant?: "mobile" | "desktop"
}

export function RegisterStep2Form({
  idPrefix,
  dataForm,
  onDataFormChange,
  onBack,
  onContinue,
  onSignIn,
  variant = "mobile",
}: RegisterStep2FormProps) {
  const {
    firstName,
    lastName,
    phoneCountryCode,
    phone,
    dateOfBirth,
    gender,
    subscribeNewsletter,
    acceptTerms,
  } = dataForm

  const headingClass =
    variant === "mobile"
      ? "text-2xl font-medium tracking-tight text-foreground/80"
      : "text-3xl font-medium tracking-tight text-foreground/80"

  const canContinue =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    dateOfBirth != null &&
    acceptTerms

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mb-1 -ml-2 text-muted-foreground hover:text-foreground"
        onClick={onBack}
        aria-label="Back to previous step"
      >
        <ChevronLeftIcon className="size-4" />
        Back
      </Button>
      <h1 className={`w-full text-left ${headingClass}`}>Create an account</h1>
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`reg-firstname-${idPrefix}`} className="text-sm">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reg-firstname-${idPrefix}`}
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) =>
              onDataFormChange((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-lastname-${idPrefix}`} className="text-sm">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reg-lastname-${idPrefix}`}
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) =>
              onDataFormChange((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-phone-${idPrefix}`} className="text-sm">
            Phone number
          </Label>
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start" className="px-1.5">
              <Select
                value={ensureDialCode(phoneCountryCode, DEFAULT_PHONE_REGION)}
                onValueChange={(v) =>
                  onDataFormChange((prev) => ({ ...prev, phoneCountryCode: v }))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-7 rounded-lg border-0 bg-transparent py-0 pr-1 pl-1.5 shadow-none focus-visible:ring-0"
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
              id={`reg-phone-${idPrefix}`}
              type="tel"
              placeholder="Please enter phone number"
              value={phone}
              inputMode="numeric"
              pattern="\d*"
              onChange={(e) =>
                onDataFormChange((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 13),
                }))
              }
              className="rounded-lg pl-1"
            />
          </InputGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-dob-${idPrefix}`} className="text-sm">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <DatePicker
            id={`reg-dob-${idPrefix}`}
            value={dateOfBirth}
            onSelect={(date) =>
              onDataFormChange((prev) => ({ ...prev, dateOfBirth: date }))
            }
            placeholder="Please enter date of birth"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-gender-${idPrefix}`} className="text-sm">
            Gender
          </Label>
          <Select
            value={gender}
            onValueChange={(v) =>
              onDataFormChange((prev) => ({ ...prev, gender: v }))
            }
          >
            <SelectTrigger
              id={`reg-gender-${idPrefix}`}
              className="w-full rounded-lg"
            >
              <SelectValue placeholder="Please select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`reg-newsletter-${idPrefix}`}
            checked={subscribeNewsletter}
            onCheckedChange={(v) =>
              onDataFormChange((prev) => ({
                ...prev,
                subscribeNewsletter: v === true,
              }))
            }
          />
          <Label
            htmlFor={`reg-newsletter-${idPrefix}`}
            className="cursor-pointer text-sm font-normal"
          >
            Subscribe to Ticketlemon&apos;s newsletter
          </Label>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id={`reg-terms-${idPrefix}`}
              checked={acceptTerms}
              onCheckedChange={(v) =>
                onDataFormChange((prev) => ({
                  ...prev,
                  acceptTerms: v === true,
                }))
              }
              className="mt-0.5"
            />
            <Label
              htmlFor={`reg-terms-${idPrefix}`}
              className="cursor-pointer text-sm font-normal"
            >
              Accept terms and condition
            </Label>
          </div>
          <p className="pl-6 text-xs text-muted-foreground">
            I agree that I have read and accepted Ticketlemon&apos;s{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
        <Button
          type="button"
          className="w-full rounded-lg"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continue
        </Button>
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-foreground">Already have an account?</span>
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-4"
            onClick={onSignIn}
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  )
}
